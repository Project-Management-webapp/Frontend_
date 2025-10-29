import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileAlt,
  FaFileVideo,
  FaFileAudio,
  FaFileArchive,
  FaFileCode,
} from "react-icons/fa";

export const getFileIcon = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return <FaFilePdf className="text-red-400" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-400" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="text-green-400" />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return <FaFileImage className="text-purple-400" />;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return <FaFileVideo className="text-pink-400" />;
    case "mp3":
    case "wav":
    case "ogg":
      return <FaFileAudio className="text-yellow-400" />;
    case "zip":
    case "rar":
    case "7z":
      return <FaFileArchive className="text-orange-400" />;
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "java":
    case "cpp":
    case "c":
    case "css":
    case "html":
      return <FaFileCode className="text-cyan-400" />;
    default:
      return <FaFileAlt className="text-gray-400" />;
  }
};

export const isImageFile = (file) => {
  if (file.type) {
    return file.type.startsWith('image/');
  }
  if (file.name) {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
  }
  return false;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 48) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};
