import { defineField, defineType } from "sanity";

const KIND_LABELS: Record<string, string> = {
  article: "Artigo",
  book: "Livro",
  study: "Estudo",
  video: "Vídeo",
  documentation: "Documentação",
  publication: "Publicação/Postagem",
  course: "Curso/Treinamento",
  tool: "Ferramenta",
  other: "Outro",
};

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
          { title: "Publicação/Postagem", value: "publication" },
          { title: "Curso/Treinamento", value: "course" },
          { title: "Ferramenta", value: "tool" },
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
      return {
        title,
        subtitle: [KIND_LABELS[kind] ?? kind, url].filter(Boolean).join(" · "),
      };
    },
  },
});
