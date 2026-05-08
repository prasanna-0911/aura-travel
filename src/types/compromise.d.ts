declare module 'compromise' {
  interface NlpDocument {
    adjectives(): NlpDocument;
    nouns(): NlpDocument;
    places(): NlpDocument;
    verbs(): NlpDocument;
    out(format?: string): string | string[];
    text(): string;
    json(): object[];
  }

  function nlp(text: string): NlpDocument;
  export default nlp;
}
