import CourseDetailPage from "@/page/dashboard/CourseDetailPage";


export default async function CourseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div>
            <CourseDetailPage
             id={id}
            ></CourseDetailPage>
        </div>
    )
}