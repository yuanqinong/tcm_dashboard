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
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  
  const showAlert = (message, severity) => {
    setAlert({ message, severity});
  };

  const closeAlert = () => {
    setAlert(null);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsTokenAvailable(!!token);
  }, []);

  useEffect(() => {
    if (isTokenAvailable) {
      fetchUploadedFiles();
      fetchUploadedLinks();
    }
  }, [isTokenAvailable]);

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
      {alert && (
      <div className="alert-container">
        <Alert
          message={alert.message}
          severity={alert.severity}
          onClose={() => {closeAlert()}}
        />
        </div>
      )}
    </div>
  );
}

export default ContentManager;
