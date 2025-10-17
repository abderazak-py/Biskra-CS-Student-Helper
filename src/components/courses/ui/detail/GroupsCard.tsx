import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupsCard({ course }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Assigned Groups</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {course.multiGroups.length ? (
                    course.multiGroups.map((g: string) => (
                        <span key={g} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              {g}
            </span>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">No groups assigned</p>
                )}
            </CardContent>
        </Card>
    );
}
