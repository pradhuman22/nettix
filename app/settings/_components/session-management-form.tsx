import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Session } from "better-auth";
import { IconDeviceLaptop } from "@tabler/icons-react";

const getDeviceInfoFromUserAgent = (userAgent?: string | null) => {
  if (!userAgent) {
    return {
      label: "Unknown device",
      details: "We couldn't detect details about this session.",
    };
  }

  let browser = "Unknown browser";
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edg")) browser = "Microsoft Edge";

  let os = "Unknown OS";
  if (userAgent.includes("Mac OS X") || userAgent.includes("Macintosh")) {
    os = "macOS";
  } else if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
  }

  return {
    label: `${browser} on ${os}`,
    details: userAgent,
  };
};

const SessionManagement = async ({
  session,
}: {
  session: Session | undefined;
}) => {
  const { label, details } = getDeviceInfoFromUserAgent(session?.userAgent);

  return (
    <Card>
      <CardContent className="flex items-start gap-5">
        <IconDeviceLaptop className="stroke-muted-foreground size-10" />
        <div className="space-y-1">
          <CardTitle className="font-medium">{label}</CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            {details}
          </CardDescription>
        </div>
        <Badge className="bg-primary text-primary-foreground rounded-xl p-2 text-xs">
          This Device
        </Badge>
      </CardContent>
    </Card>
  );
};

export default SessionManagement;
