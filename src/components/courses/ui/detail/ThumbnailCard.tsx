import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {CourseDetailModel} from "@/model/courseModel";

type CourseDetailsTabProps = {
    course: CourseDetailModel;
}

export default function ThumbnailCard({ course }: CourseDetailsTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
                {
                    course?.thumbnailUrl ? <img
                        src={course.thumbnailUrl}
                        alt="Course thumbnail"
                        className="w-full h-48 object-cover rounded-lg border"
                    /> : <></>
                }
            </CardContent>
        </Card>
    );
}
