import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumo",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "publishedAt",
      title: "Data de publicação",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "listImage",
      title: "Capa da listagem",
      description: "1280×720 px (16:9). Aparece nos cards do blog.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Capa do artigo",
      description: "1920×1080 px (16:9). Aparece no topo da página do post.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Imagem para redes sociais",
      description: "1200×630 px (opcional). LinkedIn, X, WhatsApp. Se vazio, usa a capa do artigo.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "body",
      title: "Conteúdo",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Citação", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrito", value: "strong" },
              { title: "Itálico", value: "em" },
              { title: "Código", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Legenda",
              type: "string",
            }),
          ],
        },
        {
          type: "code",
          title: "Bloco de código",
          options: {
            language: "typescript",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "JavaScript", value: "javascript" },
              { title: "Bash", value: "bash" },
              { title: "JSON", value: "json" },
              { title: "SQL", value: "sql" },
              { title: "Texto", value: "text" },
            ],
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "references",
      title: "Referências, fontes e estudos",
      description: "Lista exibida ao final do artigo, antes dos comentários.",
      type: "array",
      of: [{ type: "postReference" }],
    }),
  ],
  orderings: [
    {
      title: "Data de publicação (mais recente)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      listImage: "listImage",
      heroImage: "heroImage",
      date: "publishedAt",
    },
    prepare({ title, listImage, heroImage, date }) {
      return {
        title,
        media: listImage ?? heroImage,
        subtitle: date ? new Date(date).toLocaleDateString("pt-BR") : undefined,
      };
    },
  },
});
