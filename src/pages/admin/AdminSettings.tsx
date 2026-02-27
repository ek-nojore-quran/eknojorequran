import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">সেটিংস</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> সাধারণ সেটিংস
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            সেটিংস পেজ পরবর্তী ফেজে যুক্ত করা হবে। এতে থাকবে:
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground list-disc list-inside">
            <li>ওয়েবসাইট নাম ও লোগো পরিবর্তন</li>
            <li>পাসওয়ার্ড পরিবর্তন</li>
            <li>MCQ সময়সীমা সেটিং</li>
            <li>সার্টিফিকেট টেমপ্লেট আপলোড</li>
            <li>অটো মার্কিং চালু/বন্ধ</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
