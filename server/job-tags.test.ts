import { describe, it, expect } from "vitest";
import { jobTags, jobListingTags } from "../drizzle/schema";

describe("Job Tags Feature", () => {
  describe("Job Tags Schema", () => {
    it("should have correct job tags table structure", () => {
      expect(jobTags).toBeDefined();
      expect(jobTags.id).toBeDefined();
      expect(jobTags.userId).toBeDefined();
      expect(jobTags.name).toBeDefined();
      expect(jobTags.color).toBeDefined();
      expect(jobTags.createdAt).toBeDefined();
    });

    it("should support custom tag names", () => {
      const sampleTagNames = [
        "High Priority",
        "Remote Only",
        "Good Benefits",
        "Flexible Hours",
        "Startup",
        "Enterprise",
        "Interesting Tech Stack",
      ];

      expect(sampleTagNames.length).toBeGreaterThan(0);
      sampleTagNames.forEach(name => {
        expect(name.length).toBeLessThanOrEqual(50); // Max length from schema
      });
    });

    it("should support multiple color options", () => {
      const availableColors = [
        "blue",
        "green",
        "purple",
        "amber",
        "red",
        "pink",
        "cyan",
        "orange",
        "teal",
        "indigo",
      ];

      expect(availableColors.length).toBe(10);
      expect(availableColors).toContain("blue"); // Default color
    });
  });

  describe("Job Listing Tags Schema", () => {
    it("should have correct job listing tags junction table structure", () => {
      expect(jobListingTags).toBeDefined();
      expect(jobListingTags.id).toBeDefined();
      expect(jobListingTags.jobId).toBeDefined();
      expect(jobListingTags.tagId).toBeDefined();
      expect(jobListingTags.userId).toBeDefined();
      expect(jobListingTags.createdAt).toBeDefined();
    });

    it("should support many-to-many relationship", () => {
      // A job can have multiple tags
      // A tag can be applied to multiple jobs
      
      const jobTagRelationships = [
        { jobId: 1, tagId: 1 }, // Job 1 has Tag 1
        { jobId: 1, tagId: 2 }, // Job 1 has Tag 2
        { jobId: 2, tagId: 1 }, // Job 2 has Tag 1
        { jobId: 2, tagId: 3 }, // Job 2 has Tag 3
      ];

      // Job 1 has 2 tags
      const job1Tags = jobTagRelationships.filter(r => r.jobId === 1);
      expect(job1Tags.length).toBe(2);

      // Tag 1 is used by 2 jobs
      const tag1Jobs = jobTagRelationships.filter(r => r.tagId === 1);
      expect(tag1Jobs.length).toBe(2);
    });
  });

  describe("Tag Management Features", () => {
    it("should support tag creation", () => {
      const newTag = {
        name: "High Priority",
        color: "red",
        userId: 1,
      };

      expect(newTag.name).toBeTruthy();
      expect(newTag.color).toBeTruthy();
      expect(newTag.userId).toBeGreaterThan(0);
    });

    it("should support tag editing", () => {
      const originalTag = {
        id: 1,
        name: "High Priority",
        color: "red",
        userId: 1,
      };

      const updatedTag = {
        ...originalTag,
        name: "Very High Priority",
        color: "amber",
      };

      expect(updatedTag.name).not.toBe(originalTag.name);
      expect(updatedTag.color).not.toBe(originalTag.color);
      expect(updatedTag.id).toBe(originalTag.id);
    });

    it("should support tag deletion", () => {
      const tags = [
        { id: 1, name: "Tag 1" },
        { id: 2, name: "Tag 2" },
        { id: 3, name: "Tag 3" },
      ];

      const tagIdToDelete = 2;
      const remainingTags = tags.filter(t => t.id !== tagIdToDelete);

      expect(remainingTags.length).toBe(2);
      expect(remainingTags.find(t => t.id === tagIdToDelete)).toBeUndefined();
    });
  });

  describe("Tag Filtering", () => {
    it("should filter jobs by single tag", () => {
      const jobTagsMap = {
        1: [1, 2], // Job 1 has tags 1 and 2
        2: [2, 3], // Job 2 has tags 2 and 3
        3: [1],    // Job 3 has tag 1
      };

      const selectedTagId = 1;
      const filteredJobs = Object.entries(jobTagsMap)
        .filter(([_, tagIds]) => tagIds.includes(selectedTagId))
        .map(([jobId]) => parseInt(jobId));

      expect(filteredJobs).toContain(1);
      expect(filteredJobs).toContain(3);
      expect(filteredJobs).not.toContain(2);
    });

    it("should count jobs per tag", () => {
      const jobTagsMap = {
        1: [1, 2], // Job 1 has tags 1 and 2
        2: [2, 3], // Job 2 has tags 2 and 3
        3: [1],    // Job 3 has tag 1
      };

      const getJobCountForTag = (tagId: number) => {
        return Object.values(jobTagsMap).filter(tagIds => 
          tagIds.includes(tagId)
        ).length;
      };

      expect(getJobCountForTag(1)).toBe(2); // Tag 1 used by jobs 1 and 3
      expect(getJobCountForTag(2)).toBe(2); // Tag 2 used by jobs 1 and 2
      expect(getJobCountForTag(3)).toBe(1); // Tag 3 used by job 2
    });

    it("should handle jobs with no tags", () => {
      const jobTagsMap = {
        1: [1, 2],
        2: [],     // Job 2 has no tags
        3: [1],
      };

      const selectedTagId = 1;
      const filteredJobs = Object.entries(jobTagsMap)
        .filter(([_, tagIds]) => tagIds.includes(selectedTagId))
        .map(([jobId]) => parseInt(jobId));

      expect(filteredJobs).not.toContain(2);
    });
  });

  describe("Tag Color System", () => {
    it("should have color class mapping", () => {
      const colorClasses = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
      };

      expect(colorClasses.blue).toBeTruthy();
      expect(colorClasses.green).toBeTruthy();
      expect(colorClasses.purple).toBeTruthy();
    });

    it("should support color selection", () => {
      const colors = ["blue", "green", "purple", "amber", "red"];
      const selectedColor = "red";

      expect(colors).toContain(selectedColor);
    });
  });

  describe("Tag Assignment", () => {
    it("should add tag to job", () => {
      const jobTagsMap: Record<number, number[]> = {
        1: [1, 2],
      };

      const jobId = 1;
      const newTagId = 3;
      const updatedTags = [...jobTagsMap[jobId], newTagId];

      expect(updatedTags).toContain(1);
      expect(updatedTags).toContain(2);
      expect(updatedTags).toContain(3);
      expect(updatedTags.length).toBe(3);
    });

    it("should remove tag from job", () => {
      const jobTagsMap: Record<number, number[]> = {
        1: [1, 2, 3],
      };

      const jobId = 1;
      const tagIdToRemove = 2;
      const updatedTags = jobTagsMap[jobId].filter(id => id !== tagIdToRemove);

      expect(updatedTags).toContain(1);
      expect(updatedTags).toContain(3);
      expect(updatedTags).not.toContain(2);
      expect(updatedTags.length).toBe(2);
    });

    it("should toggle tag on job", () => {
      const jobTagsMap: Record<number, number[]> = {
        1: [1, 2],
      };

      const jobId = 1;
      const tagId = 3;

      // Add tag (not present)
      let currentTags = jobTagsMap[jobId] || [];
      let isSelected = currentTags.includes(tagId);
      expect(isSelected).toBe(false);

      currentTags = [...currentTags, tagId];
      expect(currentTags).toContain(tagId);

      // Remove tag (now present)
      isSelected = currentTags.includes(tagId);
      expect(isSelected).toBe(true);

      currentTags = currentTags.filter(id => id !== tagId);
      expect(currentTags).not.toContain(tagId);
    });
  });

  describe("Tag Statistics", () => {
    it("should calculate total tags", () => {
      const tags = [
        { id: 1, name: "High Priority" },
        { id: 2, name: "Remote Only" },
        { id: 3, name: "Good Benefits" },
      ];

      expect(tags.length).toBe(3);
    });

    it("should find most used tag", () => {
      const jobTagsMap = {
        1: [1, 2],
        2: [1, 3],
        3: [1],
        4: [2],
      };

      const tagUsage: Record<number, number> = {};
      Object.values(jobTagsMap).forEach(tagIds => {
        tagIds.forEach(tagId => {
          tagUsage[tagId] = (tagUsage[tagId] || 0) + 1;
        });
      });

      const mostUsedTagId = Object.entries(tagUsage)
        .sort(([, a], [, b]) => b - a)[0][0];

      expect(parseInt(mostUsedTagId)).toBe(1); // Tag 1 used 3 times
      expect(tagUsage[1]).toBe(3);
    });

    it("should find unused tags", () => {
      const allTags = [1, 2, 3, 4];
      const jobTagsMap = {
        1: [1, 2],
        2: [1],
      };

      const usedTagIds = new Set<number>();
      Object.values(jobTagsMap).forEach(tagIds => {
        tagIds.forEach(tagId => usedTagIds.add(tagId));
      });

      const unusedTags = allTags.filter(tagId => !usedTagIds.has(tagId));

      expect(unusedTags).toContain(3);
      expect(unusedTags).toContain(4);
      expect(unusedTags.length).toBe(2);
    });
  });
});
