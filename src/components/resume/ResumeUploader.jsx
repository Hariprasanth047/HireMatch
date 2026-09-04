import { FileText, UploadCloud, Loader2, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { resumeService } from '../../services/resumeService';

export default function ResumeUploader({ resume, setResume, onUploaded }) {
  const inputRef = useRef(null);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileName = file.name.toLowerCase();
    const isValid = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setUploadError('Invalid file type. Please upload a PDF, DOC, or DOCX resume.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const res = await resumeService.uploadResumeFile(file);
      if (res.success && res.resume) {
        setResume(res.resume);
        onUploaded?.('Resume uploaded and analyzed successfully!');
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!resume) return;
    try {
      if (resume._id || resume.id) {
        await resumeService.deleteResume(resume._id || resume.id);
      }
      setResume(null);
      setConfirmRemove(false);
      onUploaded?.('Resume removed');
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Failed to remove resume');
      setConfirmRemove(false);
    }
  };

  return (
    <>
      <div
        className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900 transition hover:border-primary-500"
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {isUploading ? (
          <Loader2 className="mx-auto h-10 w-10 text-primary-600 animate-spin" />
        ) : (
          <UploadCloud className="mx-auto h-10 w-10 text-primary-600" />
        )}

        <h2 className="mt-3 text-lg font-semibold">
          {isUploading ? 'Analyzing Resume Document...' : 'Upload Resume'}
        </h2>
        <p className="text-sm text-slate-500">
          Drag and drop your PDF or DOCX resume, or click to browse (Max: 5MB).
        </p>

        {uploadError && (
          <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{uploadError}</p>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <Button
          className="mt-4"
          disabled={isUploading}
          onClick={() => inputRef.current.click()}
        >
          {isUploading ? 'Uploading...' : resume ? 'Replace Resume' : 'Choose Resume File'}
        </Button>
      </div>

      {resume && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <FileText className="h-9 w-9 text-primary-600" />
            <div>
              <p className="font-semibold">{resume.name || resume.originalFileName}</p>
              <p className="text-sm text-slate-500">
                {resume.size || resume.fileSize} • Uploaded {resume.uploadDate || (resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Recently')} •{' '}
                <span className="text-emerald-600 font-medium">{resume.status || 'Analysis Complete'}</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {resume.downloadUrl && (
              <a
                href={`http://localhost:5000${resume.downloadUrl}`}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Button variant="outline">
                  <Download className="mr-1 h-4 w-4 inline" /> Download
                </Button>
              </a>
            )}
            <Button variant="danger" onClick={() => setConfirmRemove(true)}>
              Remove Resume
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={confirmRemove}
        title="Remove resume?"
        danger
        confirmLabel="Remove"
        onClose={() => setConfirmRemove(false)}
        onConfirm={handleRemove}
      >
        This will delete your uploaded resume and analysis from the database.
      </Modal>
    </>
  );
}
