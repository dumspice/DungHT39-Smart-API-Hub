export const RELATION_CONFIG: Record<
  string,
  { expand: string[]; embed: string[] }
> = {
  Users: {
    expand: [],
    embed: ["posts", "rating", "blog"],
  },

  Posts: {
    expand: ["user"], // post -> user (belongsTo)
    embed: ["comments"], // post -> comments (hasMany)
  },

  Comments: {
    expand: ["post"], // comment -> post
    embed: [],
  },

  Rating: {
    expand: ["user"], // rating -> user
    embed: [],
  },

  Blog: {
    expand: ["user"], // blog -> user
    embed: [],
  },

  Category: {
    expand: [],
    embed: [],
  },
};
