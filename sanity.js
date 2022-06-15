import { createImageUrlBuilder, createCurrentUserHook, createClient } from "next-sanity";

export const config = {
    /**
     * Find your project ID and dataset in 'sanity.json' in your studio project.
     * These are considering "public", but you can sue enviroment variables
     * if you what differ between local dev and production
     *
     * https://nextjs.org/docs/basic-features/enviroment-variables
     */
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-10-21",

    /**
     * Set useCdn to 'false' if your application require the freshest possible
     * data always (potentially slightly slower and a bit more expensive).
     * Authentification request (like preview) will always bypass the CDN
     */
    useCdn: process.env.NODE_ENV === "production",
};

// Set up the client for fetching data in the getProps page functions
export const sanityClient = createClient(config);

/**
 * Set up a helper function for generating Image with only the asset
 * reference data in your documents
 * Read more: https://sanity.io/docs/image-url
 */
export const urlFor = (source) => createImageUrlBuilder(config).image(source);
