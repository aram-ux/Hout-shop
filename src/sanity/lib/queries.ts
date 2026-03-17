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

export const relatedProductsQuery = groq`
  *[_type == "product" && _id != $currentId && category->slug.current == $categorySlug && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...3] {
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
    heroTitle,
    heroSubtitle,
    heroCta,
    heroSecondaryCta,
    aboutImage,
    aboutPreviewTitle,
    aboutPreviewSubtitle,
    aboutPreviewDescription,
    aboutPreviewCta,
    featuredTitle,
    featuredSubtitle,
    featuredBanner,
    trustItems[]{
      icon,
      title,
      description
    },
    trustBadges
  }
`;

// ---- About Page Query ----

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    pageTitle,
    pageSubtitle,
    pageDescription,
    storyTitle,
    storyText,
    storyImage,
    values[]{
      icon,
      title,
      description
    },
    qualityTitle,
    qualityText,
    sustainableTitle,
    sustainableText,
    gallery,
    teamPhoto
  }
`;

// ---- Contact Page Query ----

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    pageTitle,
    pageDescription,
    heroImage,
    address,
    phone,
    email,
    openingHours,
    googleMapsEmbed,
    formSuccessMessage
  }
`;

// ---- Products Page Query ----

export const productsPageQuery = groq`
  *[_type == "productsPage"][0] {
    pageTitle,
    pageSubtitle,
    heroBanner,
    emptyStateMessage
  }
`;

// ---- Info Page Query ----

export const infoPageQuery = groq`
  *[_type == "infoPage"][0] {
    pageTitle,
    pageSubtitle,
    pageDescription,
    qualitiesTitle,
    qualitiesIntro,
    qualities[]{
      name,
      description,
      features[]{
        nl,
        fr,
        en
      }
    },
    panelsTitle,
    panelsIntro,
    panels[]{
      name,
      description
    },
    originsTitle,
    originsIntro,
    origins[]{
      name,
      description
    },
    dimensionsTitle,
    dimensionsIntro,
    dimensionsPropertyLabel,
    dimensionsRangeLabel,
    dimensions[]{
      label,
      value
    },
    generalTitle,
    generalPropertyLabel,
    generalValueLabel,
    generalInfo[]{
      label,
      value
    },
    ctaTitle,
    ctaText,
    ctaProductsLabel,
    ctaContactLabel
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

// ---- Blog Queries ----

export const allBlogPostsQuery = groq`
  *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author,
    tags
  }
`;

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    mainImage,
    publishedAt,
    author,
    tags,
    seoTitle,
    seoDescription
  }
`;

export const recentBlogPostsQuery = groq`
  *[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    tags
  }
`;
