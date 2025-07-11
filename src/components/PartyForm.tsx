import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Checkbox,
  Button,
  Drawer,
  Space,
} from "antd";
import { statedata } from "./StateData";

const { Title } = Typography;
const { Option } = Select;

import {
  PlusOutlined,
  DeleteOutlined,
  MailOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { TreeSelect } from "antd";
import type { TreeSelectProps } from "antd";

const treeData = [
  {
    value: "Trade Payables - Sundry Creditors",
    title: "Trade Payables - Sundry Creditors",
  },
  {
    value: "TradeReceivables-SundryDebtors",
    title: "Trade Receivables - Sundry Debtors",
    children: [
      {
        value: "Rajasthan",
        title: "Rajasthan",
        children: [
          { value: "dmart", title: "dmart" },
          { value: "DPS", title: "DPS" },
          { value: "DSFDSF", title: "DSFDSF" },
          { value: "Jodhpur", title: "Jodhpur" },
        ],
      },
    ],
  },
];
export interface PartyFormValues {
  partyName: string;
  alias?: string;
  partyGroup: string;
  gstType?: string;
  gstin?: string;
  pan?: string;
  state?: string;
  businessType?: string;
  businessNature?: string[];
  website?: string;
  iec?: string;
  msme?: string;
  isTransporter?: boolean;
  contacts?: {
    name?: string;
    designation?: string;
    phone?: string;
    email?: string;
    cc?: string;
  }[];
  addresses?: any[];
}
const gstTypes = [
  { id: 1, name: "Unregistered" },
  { id: 2, name: "Regular" },
  { id: 3, name: "Composition" },
  { id: 4, name: "Import/Export" },
  { id: 5, name: "SEZ" },
  { id: 6, name: "Deemed Export/Import" },
];
const businessTypes = [
  { id: 1, name: "Private Limited" },
  { id: 2, name: "Public Limited" },
  { id: 3, name: "Sole Proprietorship" },
  { id: 4, name: "Partnership" },
  { id: 5, name: "LLP" },
  { id: 6, name: "LLC" },
  { id: 7, name: "HUF" },
  { id: 8, name: "NGO" },
  { id: 9, name: "Govt Authority" },
];
const businessNatures = [
  { id: 1, name: "Unspecified" },
  { id: 2, name: "Manufacturing" },
  { id: 3, name: "Service Provider" },
  { id: 4, name: "Trader" },
];
const addressTypes = [
  { id: 1, name: "Registered Address" },
  { id: 2, name: "Business Address" },
  { id: 3, name: "Branch Address" },
  { id: 4, name: "Unit Address" },
  { id: 5, name: "Godown Address" },
];
interface IOpen {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
  initialValues?: PartyFormValues | null;
  onSave?: (values: PartyFormValues) => void;
}

const Partyform: React.FC<IOpen> = (props: IOpen) => {
  const [form] = Form.useForm();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectGst, setSelectGst] = useState<number | String>("Unregistered");

  const [value, setValue] = useState<string>();

  const onChange = (newValue: string) => {
    setValue(newValue);
    setSelectedOption(newValue);
  };
  const onPopupScroll: TreeSelectProps["onPopupScroll"] = (e) => {
    console.log("onPopupScroll", e);
  };

  const handleSubmit = async () => {
  try {
    const values = await form.validateFields();

      if (values.msme) {
      const cleanMsme = values.msme.replace(/^UDYAM-/, "");
      values.msme = `UDYAM-${cleanMsme}`;
    }
    if (values.addresses) {
      values.addresses = values.addresses.map((addr: any) => ({
        type: addr.type ?? 0,
        addressName: addr.addressName || "",
        address: {
          building: addr.building || "",
          street: addr.street || "",
          landmark: addr.landmark ?? null,
          city: addr.city || "",
          district: addr.district || "",
          pincode: addr.pincode || "",
          state: Number(addr.state) || 0,
          overseasState: Number(addr.overseasState) || 0,
          country: addr.country || "",
        },
      }));
    }
    if (props.onSave) {
      props.onSave(values);
    } else {
      const existingData = JSON.parse(localStorage.getItem("partyFormData") || "[]");
      const updatedData = [...existingData, values];
      localStorage.setItem("partyFormData", JSON.stringify(updatedData));
      props.setOpen(false);
    }
  } catch (error) {
    // console.log("Validation Failed:", error);
  }
};

  const handleGstNum = (value: string) => {
    setSelectGst(value);
  };
  const onClose = () => {
    form.resetFields();
    props.setOpen(false);
  };
  const gstFunction = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    const value = event.target.value;
    console.log(value);
    const panNo = value.slice(2, 12);
    console.log(panNo);
    const stateCode = value.slice(0, 2);
    console.log(stateCode);
    const result = statedata.find(({ id }) => id === parseInt(stateCode));
    form.setFieldValue("state", result?.id);
    form.setFieldValue("pan", panNo);
  };
  useEffect(() => {
    if (props.initialValues) {
      form.setFieldsValue(props.initialValues);
      setSelectedOption(props.initialValues.partyGroup);
      setSelectGst(props.initialValues.gstType || "Unregistered");
      setValue(props.initialValues.partyGroup);
    }
  }, [props.initialValues]);
  return (
    <>
      {/* --------------------------------------------Drawer--------------------------- */}
      <Drawer
        title="Add Party"
        width={920}
        onClose={() => onClose()}
        open={props.open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button
              shape="round"
              size={"middle"}
              style={{
                background: "#004b8b",
                color: "#ffff",
                fontWeight: "bold",
              }}
            >
              Business Entity
            </Button>
          </Space>
        }
        footer={
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => onClose()}>Cancel</Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              type="primary"
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          // onFinish={onFinish}
          initialValues={props.initialValues || {}}
          autoComplete="off"
          style={{ maxWidth: 1000, margin: "auto" }}
        >
          {/*---------------------------------- Party Details-------------------------------- */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Party Name"
                name="partyName"
                rules={[
                  { required: true, message: "Party Name is required" },
                  {
                    pattern: /^[a-zA-Z0-9 _()&\-.,]*$/,
                    message:
                      "Only alphanumeric with space and some special characters i.e. '_', '(', ')', '&', '-', '.' and ',' are allowed.",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || value.length === 0)
                        return Promise.resolve();

                      if (value.length < 3 || value.length > 80) {
                        return Promise.reject(
                          "Length must be Minimum 3 or Maximum 80 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Party name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Alias/Short Name"
                name="alias"
                rules={[
                  {
                    pattern: /^[a-zA-Z0-9 _()&\-.,]*$/,
                    message:
                      "Only alphanumeric with space and some special characters i.e. '_', '(', ')', '&', '-', '.' and ',' are allowed.",
                  },
                  {
                    validator: (_, value) => {
                      if (!value || value.length === 0)
                        return Promise.resolve();

                      if (value.length < 3 || value.length > 80) {
                        return Promise.reject(
                          "Length must be Minimum 3 or Maximum 80 characters long"
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Alias/Short Name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Party Group"
                name="partyGroup"
                rules={[{ required: true, message: "Party Group is required" }]}
              >
                <TreeSelect
                  showSearch
                  style={{ width: "100%" }}
                  value={value}
                  styles={{
                    popup: { root: { maxHeight: 400, overflow: "auto" } },
                  }}
                  placeholder="Please select"
                  allowClear
                  treeDefaultExpandAll
                  onChange={onChange}
                  treeData={treeData}
                  onPopupScroll={onPopupScroll}
                />
              </Form.Item>
            </Col>
          </Row>

          {/*------------------------------------------------- Business Details---------------------------------------- */}
          {(selectedOption === "TradeReceivables-SundryDebtors" ||
            selectedOption === "Rajasthan" ||
            selectedOption === "dmart" ||
            selectedOption === "DPS" ||
            selectedOption === "DSFDSF" ||
            selectedOption === "Jodhpur" ||
            selectedOption === "Trade Payables - Sundry Creditors") && (
            <>
              <Title level={4}>Business Details</Title>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    label="GST Type"
                    name="gstType"
                    style={{ marginBottom: "7px" }}
                    rules={[
                      {
                        required: true,
                        message: "GST Type is required",
                      },
                    ]}
                  >
                    <Select
                      onChange={handleGstNum}
                      placeholder="Select GST type"
                    >
                      {gstTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {selectGst === 1 && (
                  <Col span={6}>
                    <Form.Item
                      label="GSTIN"
                      name="gstin"
                      style={{ marginBottom: "7px" }}
                    >
                      <Input placeholder="00AABCC1234D1ZZ" disabled />
                    </Form.Item>
                  </Col>
                )}
                {(selectGst === 2 ||
                  selectGst === 3 ||
                  selectGst === 5 ||
                  selectGst === 6) && (
                  <Col span={6}>
                    <Form.Item
                      label="GSTIN"
                      name="gstin"
                      style={{ marginBottom: "7px" }}
                      rules={[
                        { required: true, message: "GST number is required" },
                        {
                          pattern:
                            /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/,
                          message: "Enter valid 15 alphanumeric GST number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="00AABCC1234D1ZZ"
                        onBlur={(e) => gstFunction(e)}
                        id="gstNum"
                        maxLength={15}
                      />
                    </Form.Item>
                  </Col>
                )}

                {(selectGst === 1 || selectGst === 4) && (
                  <Col span={6}>
                    <Form.Item
                      label="PAN Card"
                      name="pan"
                      style={{ marginBottom: "7px" }}
                      rules={[
                        {
                          pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                          message: "Enter valid 10 alphanumeric PAN number",
                        },
                        {
                          validator: (_, value) => {
                            if (!value) return Promise.resolve();

                            if (value.length !== 10) {
                              return Promise.reject(
                                new Error("PAN No. must be 10 characters long")
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input placeholder="AABCC1234D" maxLength={10} />
                    </Form.Item>
                  </Col>
                )}
                {(selectGst === 2 ||
                  selectGst === 3 ||
                  selectGst === 5 ||
                  selectGst === 6) && (
                  <Col span={6}>
                    <Form.Item
                      label="PAN Card"
                      name="pan"
                      style={{ marginBottom: "7px" }}
                    >
                      <Input placeholder="AABCC1234D" disabled />
                    </Form.Item>
                  </Col>
                )}
                {selectGst === 1 && (
                  <Col span={6}>
                    <Form.Item
                      label="State"
                      name="state"
                      rules={[{ required: true, message: "State is required" }]}
                      style={{ marginBottom: "7px" }}
                    >
                      <Select placeholder="State">
                        {statedata.map((s) => (
                          <Option key={s.id} value={s.id}>
                            {s.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                {(selectGst === 2 ||
                  selectGst === 3 ||
                  selectGst === 5 ||
                  selectGst === 6) && (
                  <Col span={6}>
                    <Form.Item
                      label="State"
                      name="state"
                      style={{ marginBottom: "7px" }}
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="State" disabled>
                        {statedata.map((s) => (
                          <Option key={s.id} value={s.id}>
                            {s.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )}
                <Col span={6}>
                  <Form.Item
                    label="Business Type"
                    name="businessType"
                    style={{ marginBottom: "7px" }}
                  >
                    <Select placeholder="Select type">
                      {businessTypes.map((type) => (
                        <Option key={type.id} value={type.id}>
                          {type.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Business Nature"
                    name="businessNature"
                    style={{ marginBottom: "7px" }}
                  >
                    <Select mode="multiple" placeholder="Select nature">
                      {businessNatures.map((nature) => (
                        <Option key={nature.id} value={nature.id}>
                          {nature.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="Website"
                    name="website"
                    style={{ marginBottom: "7px" }}
                    rules={[
                      {
                        pattern:
                          /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                        message: "Please enter a valid URL",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || value.length === 0)
                            return Promise.resolve();

                          if (value.length < 10 || value.length > 50) {
                            return Promise.reject(
                              "Please enter a valid URL having minimum 10 or maximum 50 length"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="https://www.example.com" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    label="IEC"
                    name="iec"
                    style={{ marginBottom: "7px" }}
                    rules={[
                      {
                        pattern: /^[a-zA-Z0-9_]*$/,
                        message: "Enter valid 10 alphanumeric IEC number",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || value.length === 0)
                            return Promise.resolve();
                          if (value.length < 10) {
                            return Promise.reject(
                              "Length must be 10 characters long"
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input placeholder="IEC Code" maxLength={10} />
                  </Form.Item>
                </Col>
                {/* </Row> */}
                {/* <Row gutter={16}> */}
                <Col span={6}>
                  <Form.Item
                    label="MSME Number"
                    name="msme"
                    rules={[
                      {
                        pattern: /^[A-Za-z]{2}-00-\d{7}$/,
                        message: "Enter valid 19 digit MSME No. including '-'",
                      },
                    ]}
                  >
                    <Input
                      addonBefore="UDYAM-"
                      placeholder="XX-00-0123456"
                      maxLength={13}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="isTransporter"
                    valuePropName="checked"
                    style={{ marginTop: 32 }}
                  >
                    <Checkbox>Is Transporter</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
              {/* ------------------------------------------------Contact Details------------------------------------------------------- */}
              <Title level={4}>Contact Details</Title>
              <Form.List name="contacts" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <Row gutter={8} align="middle" key={field.key}>
                        <Col span={5}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "name"]}
                            rules={[
                              {
                                pattern: /^[A-Za-z ]+$/,
                                message:
                                  "Only Character with space are allowed",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length === 0)
                                    return Promise.resolve();

                                  if (value.length < 3 || value.length > 30) {
                                    return Promise.reject(
                                      "Length must be Minimum 3 or Maximum 30 characters"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input placeholder="Name" maxLength={30} />
                          </Form.Item>
                        </Col>
                        <Col span={5}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "designation"]}
                            rules={[
                              {
                                pattern: /^[a-zA-Z0-9 _()&\-.,]*$/,
                                message:
                                  "Only alphanumeric with space and some special characters i.e. '_', '(', ')', '&', '-', '.' and ',' are allowed.",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length === 0)
                                    return Promise.resolve();

                                  if (value.length < 3 || value.length > 80) {
                                    return Promise.reject(
                                      "Length must be Minimum 3 or Maximum 30 characters long"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input placeholder="Designation" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "phone"]}
                            rules={[
                              {
                                pattern: /\d{10}/,
                                message: "Enter valid Phone No.",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length === 0)
                                    return Promise.resolve();

                                  if (value.length < 10) {
                                    return Promise.reject(
                                      "Length must be 10 digits long"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="9876543210"
                              suffix={<MobileOutlined />}
                              maxLength={10}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "email"]}
                            rules={[
                              {
                                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Enter valid email address",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length === 0)
                                    return Promise.resolve();

                                  if (value.length < 10 || value.length > 80) {
                                    return Promise.reject(
                                      "Length must be Minimum 10 or Maximum 80 characters"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="user@exam.com"
                              suffix={<MailOutlined />}
                              maxLength={80}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            key={field.key}
                            name={[field.name, "cc"]}
                            rules={[
                              {
                                pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Enter valid email address",
                              },
                              {
                                validator: (_, value) => {
                                  if (!value || value.length === 0)
                                    return Promise.resolve();

                                  if (value.length < 10 || value.length > 80) {
                                    return Promise.reject(
                                      "Length must be Minimum 10 or Maximum 80 characters"
                                    );
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                          >
                            <Input
                              placeholder="cc@exam.com"
                              suffix={<MailOutlined />}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          {/* <Checkbox style={{ margin: "5px" }} /> */}
                          {/* </Col>
                      <Col span={2}> */}
                          <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => remove(field.name)}
                            style={{ marginBottom: "15px" }}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => add()}
                      >
                        Add Contact
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              {/* ----------------------------------------------------Address Details------------------------------------------------------- */}
              <Title level={4}>Address Details</Title>
              <Form.List name="addresses" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field) => (
                      <div
                        className="Address"
                        key={field.key}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 24,
                          borderBottom: "1px solid #f0f0f0",
                          paddingBottom: 16,
                        }}
                      >
                        <div className="add1" style={{ width: "450px" }}>
                          <Row gutter={16}>
                            <Col span={24}>
                              <Form.Item
                                key={field.key}
                                label="Addresses Type"
                                name={[field.name, "type"]}
                                style={{ marginBottom: "2px" }}
                              >
                                <Select placeholder="Type">
                                  {addressTypes.map((type) => (
                                    <Option key={type.id} value={type.id}>
                                      {type.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                key={field.key}
                                label="Name"
                                name={[field.name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Address Name is required",
                                  },
                                  {
                                    pattern: /^[A-Za-z ()&]+$/,
                                    message:
                                      "Only alphabets with space and some special characters i.e. '(', ')' and '&' are allowed",
                                  },
                                  {
                                    validator: (_, value) => {
                                      if (!value || value.length === 0)
                                        return Promise.resolve();
                                      if (
                                        value.length < 2 ||
                                        value.length > 20
                                      ) {
                                        return Promise.reject(
                                          "Length must be Minimum 2 or Maximum 20 characters long"
                                        );
                                      }
                                      return Promise.resolve();
                                    },
                                  },
                                ]}
                              >
                                <Input placeholder="Name" />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                        <div
                          className="add2"
                          style={{ width: "100%", marginLeft: "10px" }}
                        >
                          <Row>
                            {/* <Col span={20}> */}
                            <p style={{ margin: 0, padding: 0 }}>
                              Address Details
                            </p>
                            {/* </Col> */}
                            <Row style={{ marginTop: "6px" }}>
                              <Col span={8} style={{ marginBottom: 0 }}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "building"]}
                                  style={{ marginBottom: "0px" }}
                                >
                                  <Input placeholder="Building" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "street"]}
                                  style={{ marginBottom: "0px" }}
                                >
                                  <Input placeholder="Street" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "landmark"]}
                                  style={{ marginBottom: "0px" }}
                                >
                                  <Input placeholder="Landmark" />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row style={{}}>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "city"]}
                                  style={{ marginBottom: "0px" }}
                                  rules={[
                                    {
                                      pattern: /^[A-Za-z ()&]+$/,
                                      message:
                                        "Only alphabets with space and some special characters i.e. '(', ')' and '&' are allowed",
                                    },
                                    {
                                      validator: (_, value) => {
                                        if (!value || value.length === 0)
                                          return Promise.resolve();
                                        if (
                                          value.length < 3 ||
                                          value.length > 30
                                        ) {
                                          return Promise.reject(
                                            "Length must be Minimum 3 or Maximum 30 characters long"
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Input placeholder="City" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "district"]}
                                  style={{ marginBottom: "0px" }}
                                  rules={[
                                    {
                                      pattern: /^[A-Za-z ()&]+$/,
                                      message:
                                        "Only alphabets with space and some special characters i.e. '(', ')' and '&' are allowed",
                                    },
                                    {
                                      validator: (_, value) => {
                                        if (!value || value.length === 0)
                                          return Promise.resolve();
                                        if (
                                          value.length < 3 ||
                                          value.length > 30
                                        ) {
                                          return Promise.reject(
                                            "Length must be Minimum 3 or Maximum 30 characters long"
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Input placeholder="District" />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "pincode"]}
                                  style={{ marginBottom: "0px" }}
                                  rules={[
                                    {
                                      pattern: /\d{6}/,
                                      message: "Enter valid PIN No.",
                                    },
                                    {
                                      validator: (_, value) => {
                                        if (!value || value.length === 0)
                                          return Promise.resolve();

                                        if (value.length < 6) {
                                          return Promise.reject(
                                            "Length must be 6 digits long"
                                          );
                                        }
                                        return Promise.resolve();
                                      },
                                    },
                                  ]}
                                >
                                  <Input placeholder="Pincode" maxLength={6} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row style={{ width: "100%" }}>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "State"]}
                                >
                                  <Select placeholder="State">
                                    {statedata.map((s) => (
                                      <Option key={s.id} value={s.id}>
                                        {s.name}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  key={field.key}
                                  name={[field.name, "country"]}
                                  // rules={[
                                  //   {
                                  //     required:true,
                                  //     // message: "Country is required"
                                  //   }
                                  // ]}
                                >
                                  <Select placeholder="Country">
                                    <Option value="india">India</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col
                                span={2}
                                style={{ marginLeft: "40px", marginTop: "5px" }}
                              >
                                <Button
                                  icon={<DeleteOutlined />}
                                  onClick={() => remove(field.name)}
                                  danger
                                  type="text"
                                />
                              </Col>
                            </Row>
                          </Row>
                        </div>
                      </div>
                    ))}

                    <Form.Item>
                      <Button
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={() => add()}
                      >
                        Add Address
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              {/* <Button htmlType="submit">Submit</Button> */}
            </>
          )}
        </Form>
      </Drawer>
    </>
  );
};

export default Partyform;
