import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function DescriptionCard({ course, setCourse }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    rows={4}
                    value={course?.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                />
            </CardContent>
        </Card>
    );
}
