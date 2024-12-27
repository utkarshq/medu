import ProductCategoryService from "../product-category"
// ... other imports

describe("ProductCategoryService", () => {
    // ... other tests ...

    it("should retrieve parent categories with specified fields", async () => {
        // ... setup (create categories with parent-child relationships)

        const parentCategory = await productCategoryService.getParentCategories(childCategory.id, { select: ["name", "handle"] })

        expect(parentCategory).toBeDefined()
        expect(parentCategory.name).toBeDefined() // Check that the selected field is present
        expect(parentCategory.handle).toBeDefined() // Check that the selected field is present
        expect(parentCategory.description).toBeUndefined() // Check that an unselected field is not present
    })

    it("should return an empty array if category doesn't exist when retrieving child categories", async () => {
        const childCategories = await productCategoryService.getChildCategories("non_existent_id")
        expect(childCategories).toEqual([])
    })

    // ... other tests ...
})
