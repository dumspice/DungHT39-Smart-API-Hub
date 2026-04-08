import { RELATION_CONFIG } from "./relationConfig";
import schema from "../../schema.json";

export const buildPrismaQuery = (resource: string, query: any) => {
  // 1. Find table (in schema.json key are lowercase like "users")
  const tableConfig = (schema.tables as any)[resource.toLowerCase()];
  if (!tableConfig) return null;

  // 2. Convert resource name to PascalCase for Prisma (example: users -> Users)
  const prismaModelName = resource.charAt(0).toUpperCase() + resource.slice(1);

  const {
    _page,
    _limit,
    _sort,
    _order,
    q,
    _fields,
    _expand,
    _embed,
    ...filters
  } = query;

  // 3. Pagination
  const limit = parseInt(_limit as string) || 10;
  const page = parseInt(_page as string) || 1;
  const pagination = _page ? { skip: (page - 1) * limit, take: limit } : {};

  // 4. Sort
  const orderBy = _sort
    ? { [_sort as string]: _order === "desc" ? "desc" : "asc" }
    : undefined;

  // 5. Filter and search
  const where: any = {};

  // Search (q) - Oly search on column that value are string
  if (q) {
    const stringFields = Object.keys(tableConfig).filter(
      (k) => getFieldType(tableConfig[k], k) === "string",
    );
    where.OR = stringFields.map((f) => ({
      [f]: { contains: q, mode: "insensitive" },
    }));
  }

  // Operators (_gte, _lte, _ne, _like)
  Object.keys(filters).forEach((key) => {
    const val = filters[key];

    if (key.endsWith("_gte"))
      addOp(where, key.replace("_gte", ""), "gte", val, tableConfig);
    else if (key.endsWith("_lte"))
      addOp(where, key.replace("_lte", ""), "lte", val, tableConfig);
    else if (key.endsWith("_ne"))
      addOp(where, key.replace("_ne", ""), "not", val, tableConfig);
    else if (key.endsWith("_like"))
      addOp(
        where,
        key.replace("_like", ""),
        "contains",
        val,
        tableConfig,
        true,
      );
    else {
      if (tableConfig[key] || key === "id") {
        where[key] = cast(val, tableConfig[key], key);
      }
    }
  });

  // _expand / _embed
  const include: any = {};
  const config = RELATION_CONFIG[prismaModelName];

  if (config) {
    //Only allow expansion if it is in the Parent list.
    if (_expand && config.expand.includes(_expand)) {
      include[_expand] = true;
    }
    // Only allow expansion if it is in the Children list.
    if (_embed && config.embed.includes(_embed)) {
      include[_embed] = true;
    }
  }

  return {
    prismaModelName,
    findArgs: {
      where,
      orderBy,
      ...pagination,
      ...(Object.keys(include).length > 0 ? { include } : {}),
    },
    countArgs: { where },
  };
};

// Helpers
const getFieldType = (def: any, fieldName: string) => {
  if (!def) {
    if (fieldName === "id") return "number";
    return "string";
  }
  return typeof def === "string" ? def : def.type;
};

const cast = (v: any, def: any, fieldName: string) => {
  const type = getFieldType(def, fieldName);
  if (type === "number") return Number(v);
  if (type === "boolean") return v === "true";
  return v;
};

const addOp = (
  where: any,
  f: string,
  op: string,
  v: any,
  conf: any,
  isLike = false,
) => {
  where[f] = {
    ...where[f],
    [op]: isLike ? v : cast(v, conf[f], f),
    ...(isLike ? { mode: "insensitive" } : {}),
  };
};
