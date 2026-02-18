import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import Docker from "dockerode";
import { TRPCError } from "@trpc/server";

// Initialize Docker client
const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export const dockerRouter = router({
  // List all containers
  listContainers: protectedProcedure
    .input(z.object({
      all: z.boolean().optional().default(true),
    }))
    .query(async ({ input }) => {
      try {
        const containers = await docker.listContainers({ all: input.all });
        return containers.map(container => ({
          id: container.Id,
          name: container.Names[0]?.replace("/", "") || "unknown",
          image: container.Image,
          state: container.State,
          status: container.Status,
          created: container.Created,
          ports: container.Ports,
        }));
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to list containers: ${error.message}`,
        });
      }
    }),

  // Get container stats
  getContainerStats: protectedProcedure
    .input(z.object({
      containerId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const container = docker.getContainer(input.containerId);
        const stats = await container.stats({ stream: false });
        
        // Calculate CPU percentage
        const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
        const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
        const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

        // Calculate memory usage
        const memoryUsage = stats.memory_stats.usage || 0;
        const memoryLimit = stats.memory_stats.limit || 1;
        const memoryPercent = (memoryUsage / memoryLimit) * 100;

        return {
          cpuPercent: cpuPercent.toFixed(2),
          memoryUsage: (memoryUsage / 1024 / 1024).toFixed(2), // MB
          memoryLimit: (memoryLimit / 1024 / 1024).toFixed(2), // MB
          memoryPercent: memoryPercent.toFixed(2),
          networkRx: stats.networks?.eth0?.rx_bytes || 0,
          networkTx: stats.networks?.eth0?.tx_bytes || 0,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get container stats: ${error.message}`,
        });
      }
    }),

  // Start container
  startContainer: protectedProcedure
    .input(z.object({
      containerId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const container = docker.getContainer(input.containerId);
        await container.start();
        return { success: true, message: "Container started successfully" };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to start container: ${error.message}`,
        });
      }
    }),

  // Stop container
  stopContainer: protectedProcedure
    .input(z.object({
      containerId: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const container = docker.getContainer(input.containerId);
        await container.stop();
        return { success: true, message: "Container stopped successfully" };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to stop container: ${error.message}`,
        });
      }
    }),

  // Remove container
  removeContainer: protectedProcedure
    .input(z.object({
      containerId: z.string(),
      force: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      try {
        const container = docker.getContainer(input.containerId);
        await container.remove({ force: input.force });
        return { success: true, message: "Container removed successfully" };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to remove container: ${error.message}`,
        });
      }
    }),

  // Create and start container
  createContainer: protectedProcedure
    .input(z.object({
      name: z.string(),
      image: z.string(),
      env: z.array(z.string()).optional(),
      ports: z.record(z.string(), z.any()).optional(),
      volumes: z.array(z.string()).optional(),
      command: z.array(z.string()).optional(),
      restartPolicy: z.enum(["no", "always", "unless-stopped", "on-failure"]).optional().default("unless-stopped"),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Pull image if not exists
        try {
          await docker.getImage(input.image).inspect();
        } catch {
          await new Promise((resolve, reject) => {
            docker.pull(input.image, {}, (err: any, stream: any) => {
              if (err) return reject(err);
              docker.modem.followProgress(stream, (err: any) => {
                if (err) return reject(err);
                resolve(true);
              });
            });
          });
        }

        // Create container
        const container = await docker.createContainer({
          name: input.name,
          Image: input.image,
          Env: input.env,
          ExposedPorts: input.ports ? Object.keys(input.ports).reduce((acc, port) => {
            acc[port] = {};
            return acc;
          }, {} as any) : undefined,
          HostConfig: {
            PortBindings: input.ports,
            Binds: input.volumes,
            RestartPolicy: {
              Name: input.restartPolicy,
              MaximumRetryCount: input.restartPolicy === "on-failure" ? 3 : 0,
            },
          },
          Cmd: input.command,
        });

        await container.start();

        return {
          success: true,
          containerId: container.id,
          message: "Container created and started successfully",
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create container: ${error.message}`,
        });
      }
    }),

  // Get container logs
  getContainerLogs: protectedProcedure
    .input(z.object({
      containerId: z.string(),
      tail: z.number().optional().default(100),
    }))
    .query(async ({ input }) => {
      try {
        const container = docker.getContainer(input.containerId);
        const logs = await container.logs({
          stdout: true,
          stderr: true,
          tail: input.tail,
          timestamps: true,
        });
        
        return {
          logs: logs.toString("utf-8"),
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to get container logs: ${error.message}`,
        });
      }
    }),

  // List images
  listImages: protectedProcedure.query(async () => {
    try {
      const images = await docker.listImages();
      return images.map(image => ({
        id: image.Id,
        tags: image.RepoTags || [],
        size: image.Size,
        created: image.Created,
      }));
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to list images: ${error.message}`,
      });
    }
  }),

  // Pull image
  pullImage: protectedProcedure
    .input(z.object({
      image: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        await new Promise((resolve, reject) => {
          docker.pull(input.image, {}, (err: any, stream: any) => {
            if (err) return reject(err);
            docker.modem.followProgress(stream, (err: any) => {
              if (err) return reject(err);
              resolve(true);
            });
          });
        });
        return { success: true, message: "Image pulled successfully" };
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to pull image: ${error.message}`,
        });
      }
    }),
});
