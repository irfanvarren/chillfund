"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FileWithPath, useDropzone } from "react-dropzone";
import { FaTrash } from "react-icons/fa";
import { UploadAssetState } from "@/lib/types/upload-asset-state";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin, Form, Input, Button, Modal, Tooltip } from "antd";
import type { FormProps } from 'antd';


interface FileWithPreview extends FileWithPath {
    preview: string;
}

type FieldType = {
    description?: string;
    price?: string;
    name?: string;
    stock?: string;
    assets: File[];
};

const initialState: UploadAssetState = {
    errors: undefined,
    status: "Message",
    message: undefined,
    success: false,
    assetURI: undefined,
    transactionHash: undefined
};

export default function UploadAsset() {

    const [loading, setLoading] = useState(false);
    const [state, setState] = useState<UploadAssetState>(initialState);
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);


    const onDrop = (acceptedFiles: FileWithPath[]) => {
        const filesWithPreview = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setFiles(filesWithPreview);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

    const clearFile = () => setFiles([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value.replace(/[^0-9.]/g, ""));
    };

    const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStock(e.target.value.replace(/[^0-9]/g, ""));
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("assets", files[0]);
            formData.append("name", values.name!);
            formData.append("price", values.price!);
            formData.append("stock", values.stock!);
            formData.append("description", values.description!);

            const response = await fetch('/api/upload-asset', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            console.log(result);

            if (!response.ok) {
                console.log(response);
                throw new Error(result.message || 'Failed to upload asset');
            }

            setState({
                status: result.status,
                message: result.message,
                success: result.success,
                assetURI: result.assetURI[0] as string,
                errors: undefined,
                transactionHash: result.transactionHash
            });

            setIsModalOpen(true);
        } catch (error) {
            console.log("error");
            console.log(error);
            setState({
                status: "Error",
                message: error instanceof Error ? error.message : 'Unknown error',
                success: false,
                assetURI: undefined,
                errors: { general: error instanceof Error ? error.message.toString() : undefined }
            });
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="container mx-auto p-6 py-24 ">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-70 z-50">

                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />

                    <b className="text-white text-lg mt-5">Uploading Image and Minting Your NFT...</b>
                </div>
            )}

            <Form layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}
                className="w-full relative">
                <div className="p-6">
                    <h1 className="text-2xl text-center font-semibold mb-5">Mint Your NFT</h1>
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div
                            {...getRootProps()}
                            className={`relative w-full lg:w-1/2 min-h-[240px] lg:min-h-[450px] border-2 rounded-lg text-center cursor-pointer ${isDragActive ? "border-blue-500" : files.length ? "border-gray-300" : "border-dashed border-gray-300"}`}
                        >
                            <input {...getInputProps()} className="hidden" disabled={files.length > 0} />
                            {files.length === 0 ? (
                                <p className="flex items-center justify-center h-full text-gray-500">
                                    {isDragActive ? "Drop the file here..." : "Drag & drop an image here"}
                                </p>
                            ) : (
                                <div className="relative w-full h-full group">
                                    <Image src={files[0].preview} alt={files[0].name} fill style={{ objectFit: "cover" }} className="rounded-md" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-200">
                                        <button onClick={clearFile} className="text-white" ><FaTrash size={20} /> </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2">
                            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter a name" }]}>
                                <Input placeholder="NFT Name" />
                            </Form.Item>
                            <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter a price" }]}>
                                <Input value={price} onChange={handleChange} placeholder="Price" />
                            </Form.Item>
                            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Please enter stock quantity" }]}>
                                <Input value={stock} onChange={handleStockChange} placeholder="Stock" />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter a description" }]}>
                                <Input.TextArea rows={4} placeholder="Description" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} className="w-full">
                                    {loading ? "Uploading..." : "Create"}
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>

            <Modal
                title={
                    <span className={state.success ? "text-green-600" : "text-red-600"}>
                        {state.status || "Message"}
                    </span>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                {state.success && state.transactionHash && (
                    <div className="mb-4">
                        <p className="font-bold mb-2">Asset URI:</p>
                        <div className="bg-gray-100 p-2 rounded break-all">
                            <Tooltip title="Click to copy" placement="right">
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(state.transactionHash) ?? '');
                                    }}
                                >
                                    {state.transactionHash}
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                )}
                {state.success && state.assetURI && (
                    <div className="mb-4">
                        <p className="font-bold mb-2">Asset URI:</p>
                        <div className="bg-gray-100 p-2 rounded break-all">
                            <Tooltip title="Click to copy" placement="right">
                                <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(String(state.assetURI) ?? '');
                                    }}
                                >
                                    {state.assetURI}
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                )}

                <p className={state.success ? "text-green-600" : "text-red-600"}>
                    {state.message}
                </p>
                <div className="mt-4">
                    <Button type="primary" onClick={() => setIsModalOpen(false)}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
