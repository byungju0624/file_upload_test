import React, { useCallback } from "react";
import styles from "./UploadTest.module.css";
import * as LinkedList from "../../common/linkedList.js";
import { useState, useEffect } from "react";
import { useRef } from "react";
const UploadTest = (props) => {
  const linkedList = new LinkedList.LinkedList();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileId = useRef(0);
  const dragRef = useRef(null);
  const onChangeFiles = useCallback(
    (e) => {
      let selectFiles = [];
      let tempFiles = files;
      if (e.type === "drop") {
        selectFiles = e.dataTransfer.files;
      } else {
        selectFiles = e.target.files;
      }
      for (const file of selectFiles) {
        tempFiles = [
          ...tempFiles,
          { id: fileId.current++, object: file, videoId: "", isLoading: true },
        ];
        if (tempFiles.length > 4) {
          tempFiles.slice(0, 4);
        } else {
          tempFiles?.map((data) => {
            if (data.videoId) {
              return;
            } else {
              console.log(`before isLoding:${data.isLoading}`);
              console.log(`video uploading`);
              data.videoId = `videoId${fileId.current}`;
              data.isLoading = false;
              console.log(`after isLoding:${data.isLoading}`);
            }
          });
        }
      }
      setFiles(tempFiles);
    },
    [files]
  );
  useEffect(() => {
    console.log(files);
    if (files.length > 4) {
      setFiles(files.slice(0, 4));
    }
  }, [files]);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      setIsDragging(true);
    }
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);
  const initDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener("dragenter", handleDragIn);
      dragRef.current.addEventListener("dragleave", handleDragOut);
      dragRef.current.addEventListener("dragover", handleDragOver);
      dragRef.current.addEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
  const resetDragEvents = useCallback(() => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener("dragenter", handleDragIn);
      dragRef.current.removeEventListener("dragleave", handleDragOut);
      dragRef.current.removeEventListener("dragover", handleDragOver);
      dragRef.current.removeEventListener("drop", handleDrop);
    }
  }, [handleDragIn, handleDragOut, handleDragOver, handleDrop]);
  useEffect(() => {
    initDragEvents();

    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  const handleFilterFile = useCallback(
    (id) => {
      setFiles(files.filter((file) => file.id !== id));
    },
    [files]
  );
  return (
    <div className={styles.container}>
      <input
        type="file"
        id="fileUpload"
        style={{ display: "none" }}
        multiple
        onChange={onChangeFiles}
      />
      <label
        className={isDragging ? styles.dragging : styles.dragDropFile}
        htmlFor="fileUpload"
        ref={dragRef}
      >
        <div>파일 첨부</div>
      </label>
      {files.length > 0 &&
        files.map((file) => {
          const {
            id,
            object: { name, size },
          } = file;
          return (
            <div key={id} className={styles.videoList}>
              <div>{`${name.split(".")[0]}.mp4`}</div>
              <div>{`${(size / 1024 / 1024).toFixed(1)}MB`}</div>
              <div
                className={styles.filter}
                onClick={() => handleFilterFile(id)}
              >
                X
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UploadTest;
