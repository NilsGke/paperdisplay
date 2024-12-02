import Images from "@/components/Images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RootPage() {
  return (
    <div className="flex items-center justify-center size-full">
      <Card>
        <CardHeader>
          <CardTitle>Your Images</CardTitle>
        </CardHeader>
        <CardContent>
          <Images />
        </CardContent>
      </Card>
    </div>
  );
}
