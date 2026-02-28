import { groq } from "next-sanity";

// ---- Product Queries ----

export const allProductsQuery = groq`
  *[_type == "product" && !(_id in path("drafts.**"))] | order(featured desc, _createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    category->{
      _id,
      title,
      slug
    },
    standardSizes[]{
      width,
      height,
      thickness,
      price
    },
    customDimensions,
    woodType,
    finish,
    inStock,
    featured
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...6] {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    category->{
      _id,
      title,
      slug
    },
    standardSizes[]{
      width,
      height,
      thickness,
      price
    },
    woodType,
    finish,
    inStock,
    featured
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    shortDescription,
    mainImage,
    images,
    category->{
      _id,
      title,
      slug
    },
    standardSizes[]{
      _key,
      width,
      height,
      thickness,
      price
    },
    customDimensions{
      enabled,
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
      availableThicknesses,
      customSizeSurcharge
    },
    woodType,
    finish,
    specifications[]{
      _key,
      label,
      value
    },
    inStock,
    featured
  }
`;

export const productsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    mainImage,
    category->{
      _id,
      title,
      slug
    },
    standardSizes[0]{
      price
    },
    woodType,
    finish,
    inStock,
    featured
  }
`;

// ---- Category Queries ----

export const allCategoriesQuery = groq`
  *[_type == "category" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $categorySlug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    description,
    image
  }
`;

// ---- Site Settings Query ----

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    title,
    description,
    logo,
    favicon,
    ogImage,
    contactEmail,
    contactPhone,
    address,
    socialLinks,
    shippingInfo,
    vatNumber
  }
`;

// ---- Home Page Query ----

export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    heroImage,
    heroAccentImage,
    heroTagline,
    aboutImage,
    featuredBanner,
    trustBadges
  }
`;

// ---- About Page Query ----

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    storyImage,
    gallery,
    teamPhoto
  }
`;

// ---- Order Queries ----

export const orderByNumberQuery = groq`
  *[_type == "order" && orderNumber == $orderNumber][0] {
    _id,
    orderNumber,
    customerName,
    customerEmail,
    items,
    totalAmount,
    status,
    molliePaymentId,
    shippingAddress,
    _createdAt
  }
`;
