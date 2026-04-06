import fs from "fs";
import path from "path";

interface TableField {
  type: string;
  relation?: boolean;
  unique?: boolean;
}

interface TableSchema {
  [fieldName: string]: string | TableField;
}

interface SchemaJson {
  tables: {
    [tableName: string]: TableSchema;
  };
}

export const generatePrismaSchema = () => {
  const schemaPath = path.join(process.cwd(), "schema.json");
  const prismaPath = path.join(process.cwd(), "prisma", "schema.prisma");

  if (!fs.existsSync(schemaPath)) {
    console.error("schema.json not found!");
    process.exit(1);
  }

  const schemaJson: SchemaJson = JSON.parse(
    fs.readFileSync(schemaPath, "utf-8"),
  );
  const { tables } = schemaJson;

  let prismaSchema = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}
`;

  for (const [tableName, fields] of Object.entries(tables)) {
    prismaSchema += `\nmodel ${capitalize(tableName)} {\n`;
    prismaSchema += `  id         Int      @id @default(autoincrement())\n`;

    const relations: string[] = [];

    for (const [fieldName, fieldType] of Object.entries(fields)) {
      const isObject = typeof fieldType !== "string";
      const typeStr =
        typeof fieldType === "string" ? fieldType : fieldType.type;
      const prismaType = mapTypeToPrisma(typeStr);

      const isUnique = isObject && fieldType.unique;

      if (fieldName.endsWith("Id")) {
        const relationModel = fieldName.slice(0, -2); // e.g. userId -> user
        const relationTable = findTableCaseInsensitive(tables, relationModel);
        if (relationTable) {
          prismaSchema += `  ${fieldName} ${prismaType}${isUnique ? " @unique" : ""}\n`;
          prismaSchema += `  ${relationModel} ${capitalize(relationTable)} @relation(fields: [${fieldName}], references: [id])\n`;
          relations.push(relationTable);
          continue;
        }
      }

      prismaSchema += `  ${fieldName} ${prismaType}\n`;
    }

    prismaSchema += `  createdAt  DateTime @default(now())\n`;
    prismaSchema += `  updatedAt  DateTime @updatedAt\n`;

    prismaSchema += `  @@map("${tableName.toLowerCase()}")\n`;

    // Add back-relations for other models that reference this one
    // (This is a simplified version, ideally we'd handle this better)
    for (const [otherTableName, otherFields] of Object.entries(tables)) {
      if (otherTableName === tableName) continue;
      for (const [otherFieldName] of Object.entries(otherFields)) {
        if (
          otherFieldName.endsWith("Id") &&
          otherFieldName.startsWith(tableName.slice(0, -1))
        ) {
          // Potential back relation
          prismaSchema += `  ${otherTableName} ${capitalize(otherTableName)}[]\n`;
        }
      }
    }

    prismaSchema += `}\n`;
  }

  fs.writeFileSync(prismaPath, prismaSchema);
  console.log("Prisma schema generated successfully at", prismaPath);
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const mapTypeToPrisma = (type: string) => {
  switch (type.toLowerCase()) {
    case "string":
      return "String";
    case "number":
      return "Int";
    case "boolean":
      return "Boolean";
    case "date":
      return "DateTime";
    default:
      return "String";
  }
};

const findTableCaseInsensitive = (tables: any, name: string) => {
  const keys = Object.keys(tables);
  // Try plural and singular
  const variants = [
    name,
    name + "s",
    name.endsWith("s") ? name.slice(0, -1) : name,
  ];
  for (const variant of variants) {
    const found = keys.find((k) => k.toLowerCase() === variant.toLowerCase());
    if (found) return found;
  }
  return null;
};

if (require.main === module) {
  generatePrismaSchema();
}
