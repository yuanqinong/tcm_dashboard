import React, { useState } from "react";
import NavBar from "../../components/TopNavBar/NavBar";
import FileUpload from "../../components/FileUpload/FileUpload";
import FileList from "../../components/FileListTable/FileListTable";
import { getUploadedFiles } from "../../Redux/actions/ContentManagerAction";

function ContentManager() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const fetchUploadedFiles = async () => {
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error("Failed to fetch uploaded files:", error);
    }
  };

  const handleUploadComplete = () => {
    fetchUploadedFiles();
  };

  return (
    <div className="content-manager">
      <NavBar />
      <FileUpload onUploadComplete={handleUploadComplete} />
      <FileList refreshTrigger={uploadedFiles} />
    </div>
  );
}

export default ContentManager;
