
'use server';
/**
 * @fileOverview Flujo para interactuar con la API de Gists de GitHub.
 *
 * - createGist: Crea un nuevo Gist anónimo con el contenido proporcionado.
 * - getGist: Obtiene el contenido de un Gist a partir de su ID.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Esquema de entrada para la creación de un Gist
const GistCreateInputSchema = z.string().describe('El contenido del archivo para el Gist.');
export type GistCreateInput = z.infer<typeof GistCreateInputSchema>;

// Esquema de salida para la creación de un Gist
const GistCreateOutputSchema = z.string().describe('El ID del Gist creado.');
export type GistCreateOutput = z.infer<typeof GistCreateOutputSchema>;

// Esquema de entrada para obtener un Gist
const GistGetInputSchema = z.string().describe('El ID del Gist a obtener.');
export type GistGetInput = z.infer<typeof GistGetInputSchema>;

// Esquema de salida para obtener un Gist
const GistGetOutputSchema = z.string().describe('El contenido del archivo del Gist.');
export type GistGetOutput = z.infer<typeof GistGetOutputSchema>;


/**
 * Crea un Gist en GitHub.
 * @param content El contenido del código para el Gist.
 * @returns El ID del Gist creado.
 */
export async function createGist(content: GistCreateInput): Promise<GistCreateOutput> {
  return createGistFlow(content);
}

/**
 * Obtiene el contenido de un Gist de GitHub.
 * @param gistId El ID del Gist.
 * @returns El contenido del primer archivo del Gist.
 */
export async function getGist(gistId: GistGetInput): Promise<GistGetOutput> {
    return getGistFlow(gistId);
}


const createGistFlow = ai.defineFlow(
  {
    name: 'createGistFlow',
    inputSchema: GistCreateInputSchema,
    outputSchema: GistCreateOutputSchema,
  },
  async (content) => {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN || GITHUB_TOKEN === "TU_NUEVO_TOKEN_DE_GITHUB_VA_AQUÍ") {
      throw new Error('401: GITHUB_TOKEN no está configurado en el servidor.');
    }

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Código generado por Code2PDF',
        public: false, // Usamos Gists secretos (no listados)
        files: {
          'code.html': {
            content: content,
          },
        },
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error de la API de GitHub:", errorBody);
        throw new Error(`Error de la API de GitHub: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.id;
  }
);


const getGistFlow = ai.defineFlow({
    name: 'getGistFlow',
    inputSchema: GistGetInputSchema,
    outputSchema: GistGetOutputSchema,
}, async (gistId) => {
    // No se requiere token para leer Gists públicos/secretos
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        throw new Error(`No se pudo obtener el Gist: ${response.statusText}`);
    }

    const data = await response.json();
    const fileName = Object.keys(data.files)[0];
    if (!fileName) {
        throw new Error("El Gist está vacío.");
    }

    return data.files[fileName].content;
});
