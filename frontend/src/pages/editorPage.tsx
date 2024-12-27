import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditorPage() {
  return (
    <div className="grid pt-6 place-items-center size-full">
      <Card>
        <CardHeader>
          <CardTitle>Editor</CardTitle>
        </CardHeader>
        <CardContent className="w-6xl">
          <div className="w-max">image editor</div>
        </CardContent>
      </Card>
    </div>
  );
}
