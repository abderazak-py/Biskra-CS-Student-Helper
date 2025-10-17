import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FactorsCard({ course }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Factors</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {course.factorsNames.length ? (
                    course.factorsNames.map((f: string) => (
                        <span key={f} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
              {f}
            </span>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm">No factors assigned</p>
                )}
            </CardContent>
        </Card>
    );
}
