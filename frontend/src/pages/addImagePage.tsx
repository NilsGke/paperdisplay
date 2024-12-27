import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UplaodArea from "@/components/UploadArea";

export default function AddImagePage() {
  return (
    <div className="grid p-4 size-full place-items-center">
      <Card className="max-w-6xl min-w-96">
        <CardHeader>
          <CardTitle>
            <h2>Add Image</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UplaodArea />
        </CardContent>
      </Card>
    </div>
  );
}
