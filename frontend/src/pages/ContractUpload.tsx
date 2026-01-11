import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function ContractUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // 验证文件类型
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('请上传 PDF 或 Word 文档');
      return;
    }

    // 验证文件大小 (最大 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB');
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/contracts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      // 上传成功后跳转到合同检索页面，并显示该合同
      navigate(`/contracts?uploaded=${response.data.id}`);
    } catch (error: any) {
      alert(error.response?.data?.detail || '上传失败');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">合同上传</h1>
        <p className="mt-2 text-gray-600">上传新的合同文档进行管理和分析</p>
      </div>

      {/* 上传区域 */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />

            <div className="text-center py-16 px-4">
              <CloudArrowUpIcon className={`mx-auto h-16 w-16 ${
                dragActive ? 'text-blue-500' : 'text-gray-400'
              }`} />
              
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">
                  拖拽文件到此处，或
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 ml-1"
                  >
                    点击上传
                  </button>
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  支持 PDF、Word 文档，最大 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 文件预览 */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DocumentTextIcon className="h-10 w-10 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                disabled={uploading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* 上传进度 */}
            {uploading && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">上传中...</span>
                  <span className="font-medium text-gray-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* 上传按钮 */}
            {!uploading && (
              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                上传合同
              </button>
            )}
          </div>
        )}

        {/* 上传说明 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">上传说明</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>上传的合同文档将自动进行智能分析和风险评估</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>系统将自动识别合同条款并提供修改建议</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>上传后可以选择相关文档进行对比分析</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>确保上传的文档内容清晰，格式规范</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}