import {FileText, FolderArchive, GanttChartIcon, ImageIcon, Video} from "lucide-react";
import {Doc} from "../../convex/_generated/dataModel";
import React, {ReactNode} from "react";

export const fileTypes = {
    jpeg: <ImageIcon />,
    png: <ImageIcon />,
    pdf: <FileText />,
    zip: <FolderArchive />,
    csv: <GanttChartIcon />,
    video: <Video />,
    svg: <ImageIcon />,
} as unknown as Record<Doc<"files">["fileType"], ReactNode>;