import { GetStaticProps } from "next";
import React from "react";
import PortableText from "react-portable-text";
import { Header } from "../../components";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";

interface Props {
    post: Post;
}

function PostDetail({ post }: Props) {
    return (
        <main>
            <Header />

            <img
                src={urlFor(post.mainImage).url()!}
                alt=""
                className="w-full h-60 object-cover"
            />

            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-500 mb-2">
                    {post.description}
                </h2>
                <div className="flex items-center space-x-2 mb-10">
                    <img
                        src={urlFor(post.author.image).url()!}
                        alt=""
                        className="h-10 w-9 rounded-full"
                    />
                    <p className="font-extralight text-sm">
                        Blog post by{" "}
                        <span className="text-green-700">{post.author.name}</span> -
                        Published at {new Date(post._createdAt).toLocaleString()}
                    </p>
                </div>
                <div>
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        serializers={{
                            h1: (props: any) => (
                                <h1 className="text-2xl font-bold my-5" {...props} />
                            ),
                            h2: (props: any) => (
                                <h2 className="text-xl font-bold my-5" {...props} />
                            ),
                            li: ({ children }: any) => (
                                <li className="ml-4 list-disc">{children}</li>
                            ),
                            link: ({ href, children }: any) => (
                                <a href={href} className="text-blue-500 hover:underline">
                                    {children}
                                </a>
                            ),
                        }}
                    />
                </div>
            </article>

            <hr className="max-w-lg my-5 mx-auto border-yellow-500" />

            <form className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
                <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
                <h4 className="text-3xl font-bold">Leave a comment below!</h4>
                <hr className="py-3 mt-2" />

                <label className="block mb-5 ">
                    <span className="text-gray-700">Name</span>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                    />
                </label>
                <label className="block mb-5 ">
                    <span className="text-gray-700">Email</span>
                    <input
                        type="text"
                        placeholder="Enter your email"
                        className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                    />
                </label>
                <label className="block mb-5 ">
                    <span className="text-gray-700">Comment</span>
                    <textarea
                        placeholder="Add a comment"
                        rows={8}
                        className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring"
                    />
                </label>
            </form>
        </main>
    );
}

export default PostDetail;

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
      slug{
        current
      }
      }`;

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current,
        },
    }));

    return {
        paths,
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `
    *[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
        name, 
        image
      },
      "comments" : *[
        _type == "comment" &&
        post._ref == ^._id &&
        approved == true
      ],
      description,
      mainImage,
      slug,
      body
      }`;

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if (!post) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            post,
        },
        revalidate: 60, // after 60 seconds the old cache will be updated
    };
};