import { defineField, defineType } from "sanity";

export const postReference = defineType({
  name: "postReference",
  title: "Referência",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      validation: (rule) => rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "kind",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Artigo", value: "article" },
          { title: "Livro", value: "book" },
          { title: "Estudo / paper", value: "study" },
          { title: "Vídeo", value: "video" },
          { title: "Documentação", value: "documentation" },
          { title: "Outro", value: "other" },
        ],
        layout: "dropdown",
      },
      initialValue: "article",
    }),
    defineField({
      name: "note",
      title: "Nota",
      description: "Contexto adicional, autores, data ou onde foi consultado.",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      url: "url",
    },
    prepare({ title, kind, url }) {
      const kindLabels: Record<string, string> = {
        article: "Artigo",
        book: "Livro",
        study: "Estudo",
        video: "Vídeo",
        documentation: "Documentação",
        other: "Outro",
      };

      return {
        title,
        subtitle: [kindLabels[kind] ?? kind, url].filter(Boolean).join(" · "),
      };
    },
  },
});
