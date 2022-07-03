import React, { DragEvent, SyntheticEvent, useCallback, useState } from 'react';
import { uploadFiles } from '.';

export const FileUploadArea: React.FC<{ path: string }> = ({ path }) => {
    const [progress, setProgress] = useState<number | null>(null);
  
    const stopEvent = (e: SyntheticEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
  
    const onDrop = useCallback((e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
  
      const onProgress = (progressEvent: ProgressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setProgress(percentCompleted);
      }
  
      uploadFiles(path, e.dataTransfer.files, onProgress)
        .then(() => {
          console.log("all files uploaded");
          setProgress(null);
        });
    }, [path]);
  
    return <div className='file-drop-area' onDrop={onDrop} onDragEnter={stopEvent} onDragOver={stopEvent} onDragLeave={stopEvent}>
      <div>Upload</div>
      {progress !== null && <div>{progress} %</div>}
    </div>;
  }
  