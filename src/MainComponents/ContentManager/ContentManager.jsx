import React, { useState } from "react";
import NavBar from "../../components/TopNavBar/NavBar";
import FileUpload from "../../components/FileUpload/FileUpload";
import FileList from "../../components/FileListTable/FileListTable";
import LinkUpload from "../../components/LinkUpload/LinkUpload";
import { getUploadedFiles, getUploadedLinks } from "../../Redux/actions/ContentManagerAction";

function ContentManager() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedLinks, setUploadedLinks] = useState([]);
  const fetchUploadedFiles = async () => {
    try {
      const files = await getUploadedFiles();
      setUploadedFiles(files);
    } catch (error) {
      console.error("Failed to fetch uploaded files:", error);
    }
  };

  const fetchUploadedLinks = async () => {
    try {
      const links = await getUploadedLinks();
      setUploadedLinks(links);
    } catch (error) {
      console.error("Failed to fetch uploaded links:", error);
    }
  };

  const handleUploadComplete = () => {
    fetchUploadedFiles();
    fetchUploadedLinks();
  };

  return (
    <div className="content-manager">
      <NavBar />
      <FileUpload onUploadComplete={handleUploadComplete} />
      <LinkUpload onUploadComplete={handleUploadComplete} />
      <FileList refreshTrigger={uploadedFiles || uploadedLinks} />
    </div>
  );
}

export default ContentManager;
