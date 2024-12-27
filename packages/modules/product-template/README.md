# Product Template Module

The Product Template module enables the creation of reusable product templates in Medusa, allowing for consistent product creation with predefined fields and variants.

## Features

### 1. Template Management
- Create and manage product templates
- Version control for templates
- Template status management (draft, published, deprecated)
- Template inheritance support

### 2. Field Types System
Templates support three field behaviors:

| Behavior | Description | Use Case |
|----------|-------------|----------|
| Static | Fixed values set during template creation | Brand names, material types |
| Dynamic | Required fields set during product creation | Product descriptions, SKUs |
| Optional | Optional fields with default values | Care instructions, special features |

### 3. Supported Value Types
- String
- Number
- Boolean
- Enum (Selection)
- Price
- Dimensions
- Weight
- Image
- Color
- Date

### 4. Field Configuration
Each field supports:
- Field name and type
- Default values
- Validation rules
- Conditional display
- Help text and placeholders
- Unit specifications
- Custom metadata

## Usage

### Creating a Template

```typescript
const template = await templateService.createTemplate({
  title: "Premium T-Shirt Template",
  required_fields: {
    title: true,
    handle: true
  },
  base_fields: [
    {
      field_name: "brand",
      field_type: "static",
      value_type: "string",
      default_value: "Premium Brand"
    },
    {
      field_name: "description",
      field_type: "dynamic",
      value_type: "string",
      is_required: true
    },
    {
      field_name: "care_instructions",
      field_type: "optional",
      value_type: "string",
      default_value: "Machine wash cold"
    }
  ],
  variant_config: {
    options: [
      {
        title: "Size",
        values: ["S", "M", "L", "XL"]
      }
    ],
    variant_fields: [
      {
        field_name: "price",
        field_type: "static",
        value_type: "price",
        default_value: 2999
      }
    ]
  }
})
```

### Creating a Product from Template

```typescript
const product = await templateService.createProductFromTemplate(
  templateId,
  {
    title: "Summer Cotton T-Shirt",
    description: "Perfect for summer days",
    care_instructions: "Hand wash recommended", // Optional override
    variants: [
      {
        options: { size: "M" },
        sku: "TSH-M-001"
      }
    ]
  }
)
```

## UI Components

### Template Creation Flow
1. **Basic Information**
   - Template name
   - Description
   - Status

2. **Field Configuration**
   - Required product fields
   - Custom fields manager
   - Field type selection
   - Value type configuration

3. **Variant Setup**
   - Option configuration
   - Variant field management
   - Pricing strategy

4. **Settings**
   - Inventory management
   - Tax settings
   - Shipping configuration

## API Routes

```typescript
// Template Management
POST   /admin/templates
GET    /admin/templates
GET    /admin/templates/:id
PUT    /admin/templates/:id
DELETE /admin/templates/:id

// Template Usage
POST   /admin/templates/:id/products
GET    /admin/templates/:id/products
```

## Database Schema

### Template Table
```sql
CREATE TABLE "template" (
  "id" varchar PRIMARY KEY,
  "title" varchar NOT NULL,
  "description" text,
  "status" varchar NOT NULL,
  "version" integer DEFAULT 1,
  "base_fields" jsonb NOT NULL,
  "variant_config" jsonb NOT NULL,
  "settings" jsonb,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
```

## Events

The module emits the following events:
- `template.created`
- `template.updated`
- `template.deleted`
- `template.product.created`

## Development

### Installation
```bash
npm install @medusajs/product-template
```

### Configuration
```typescript
// medusa-config.js
module.exports = {
  modules: {
    productTemplate: {
      resolve: "@medusajs/product-template",
      options: {
        // module options
      }
    }
  }
}
``` 