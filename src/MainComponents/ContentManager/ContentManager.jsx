import React, { useEffect, useState } from "react";
import NavBar from "../../components/TopNavBar/NavBar";
import FileUpload from "../../components/FileUpload/FileUpload";
import FileList from "../../components/FileListTable/FileListTable";
import LinkUpload from "../../components/LinkUpload/LinkUpload";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/AlertComponent/alert";
import { getUploadedFiles, getUploadedLinks } from "../../Redux/actions/ContentManagerAction";
import SessionLogout from "../../components/SessionLogout/SessionLogout";

function ContentManager() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedLinks, setUploadedLinks] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchUploadedFiles();
    fetchUploadedLinks();
  }, []);

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
      <SessionLogout />
    </div>
  );
}

export default ContentManager;
