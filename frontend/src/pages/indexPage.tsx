import Images from "@/components/Images";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RootPage() {
  return (
    <div className="flex flex-col max-h-[85vh] h-[85vh]">
      <div className="flex items-center justify-center h-full max-h-60 min-h-40">
        <h1 className="font-serif text-6xl text-center">Paper Display</h1>
      </div>

      <div className="flex flex-col items-center justify-center overflow-hidden">
        <Card className="flex flex-col max-h-screen overflow-hidden max-w-[90%]">
          <CardHeader>
            <CardTitle>Your Images</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col overflow-auto">
            <Images />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
