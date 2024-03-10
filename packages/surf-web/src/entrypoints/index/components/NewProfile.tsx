import { Form, Input, Modal, Radio, Space } from "antd";
import * as stylex from "@stylexjs/stylex";
import { useNavigate } from "react-router-dom";
import { IonEarth, MingcuteTransferFill } from "@/icons";

interface FieldType {
  name: string;
  type: string;
}

const styles = stylex.create({
  radioValueContainer: {},
  title: {
    display: "flex",
    alignItems: "center",
    columnGap: 2,
  },
  desc: {
    color: "gray",
  },
});

export default function NewProfile({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [form] = Form.useForm<FieldType>();
  const navigate = useNavigate();

  const handleOk = () => {
    form.validateFields().then(() => {
      const { name } = form.getFieldsValue();
      navigate(`/profile/${name}`);
      setIsOpen(false);
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="新建情景模式"
      open={isOpen}
      onOk={handleOk}
      okText="确定"
      onCancel={handleCancel}
      cancelText="取消"
      destroyOnClose
    >
      <Form
        form={form}
        name="new-profile"
        initialValues={{ type: "FixedProfile" }}
        layout="vertical"
        autoComplete="off"
        preserve={false}
      >
        <Form.Item<FieldType>
          label="名称"
          name="name"
          rules={[{ required: true, message: "情景模式名称不能为空。" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="类型"
          name="type"
          rules={[{ required: true, message: "情景模式名称不能为空。" }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="FixedProfile">
                <div {...stylex.props(styles.radioValueContainer)}>
                  <div {...stylex.props(styles.title)}>
                    <IonEarth />
                    代理服务器
                  </div>
                  <div {...stylex.props(styles.desc)}>
                    经过代理服务器访问网站。
                  </div>
                </div>
              </Radio>
              <Radio value="SwitchProfile">
                <div {...stylex.props(styles.radioValueContainer)}>
                  <div {...stylex.props(styles.title)}>
                    <MingcuteTransferFill />
                    自动切换模式
                  </div>
                  <div {...stylex.props(styles.desc)}>
                    根据多种条件，如域名或网址等自动选择情景模式。您也可以导入在线发布的切换规则（如
                    AutoProxy 列表）以简化设置。
                  </div>
                </div>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
