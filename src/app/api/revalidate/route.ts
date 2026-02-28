import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { _type, slug } = body;

    // Revalidate based on the document type that changed
    switch (_type) {
      case "product":
        // Revalidate the products listing page
        revalidatePath("/[locale]/products", "page");
        // Revalidate the specific product page if slug is available
        if (slug?.current) {
          revalidatePath(`/[locale]/products/${slug.current}`, "page");
        }
        // Also revalidate the home page (featured products)
        revalidatePath("/[locale]", "page");
        break;

      case "category":
        revalidatePath("/[locale]/products", "page");
        break;

      case "homePage":
        revalidatePath("/[locale]", "page");
        break;

      case "aboutPage":
        revalidatePath("/[locale]/about", "page");
        break;

      case "siteSettings":
        // Revalidate everything
        revalidatePath("/", "layout");
        break;

      default:
        // Revalidate everything as fallback
        revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, type: _type });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { revalidated: false, error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
