import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TitleCard({ course, setCourse }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>
                <Input
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder="Enter course title"
                />
            </CardContent>
        </Card>
    );
}
