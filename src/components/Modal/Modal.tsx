import React, { useEffect, useState } from "react";
import { FC } from "react";
import {
  CloseOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import styled from "styled-components";
import s from "./Modal.module.scss";
import moment from "moment";

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  value: number | string;
};

const FormStyled = styled(Form)`
  width: 100%;
`;

const InputWrapper = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: space-around;
  }
`;

const ButtonWrapper = styled(Form.Item)`
  .ant-form-item-control-input-content {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    button {
      width: 214px !important;
      margin: 0 !important;
    }
  }
`;

const Modal: FC<CustomModalProps> = ({ isOpen, onClose, value }) => {
  const [form] = Form.useForm();
  const currentDay = moment(value).unix();
  const currentUser = localStorage.getItem("currentUser");
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [hasTasks, setHasTasks] = useState<boolean>(false); 

  const onFinish = (values: any) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      message.error("Сначала признайся, как тебя зовут =)");
      return;
    }

    const formValues = {
      ...values,
    };
    const allTasks = JSON.parse(localStorage.getItem("tasks") || "{}");
    const existingUserTasks = allTasks[currentUser] || {};
    const newTasks = {
      ...allTasks,
      [currentUser]: {
        ...existingUserTasks,
        ...formValues,
      },
    };
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  useEffect(() => {
    if (currentUser) {
      const tasksString = localStorage.getItem("tasks");
      if (tasksString) {
        const tasks = JSON.parse(tasksString);
        Object.keys(tasks).forEach((user) => {
          if (user === currentUser) {
            Object.keys(tasks[user]).forEach((timestamp) => {
              if (+timestamp === currentDay) {
                setUserTasks(tasks[user][timestamp]);
              }
            });
          }
        });
      } else {
        console.log("Нет данных в localStorage");
      }
    } else {
      console.log("Пользователь не авторизован");
    }
  }, [currentDay, currentUser]);

  useEffect(() => {
    if (userTasks.length > 0) {
      form.setFieldsValue({ [`${currentDay}`]: userTasks });
      setHasTasks(true); 
    } else {
      setHasTasks(false); 
    }
  }, [userTasks]);

  return (
    <div className={`${s.modal} ${isOpen ? s.modalOpen : ""}`}>
      <div className={`${s.modalContent} ${isOpen ? s.modalContentOpen : ""}`}>
        <div className={s.modalClose}>
          <CloseOutlined onClick={() => onClose()} />
        </div>
        <FormStyled
          form={form}
          name="dynamic_form_item"
          onFinish={onFinish}
          initialValues={{ [`${currentDay}`]: userTasks }}
          style={{ maxWidth: 600 }}
        >
          <h2>{`Задачи ${moment(value).utc(true).format("DD.MM.YYYY")}`}</h2>
          <Form.List name={`${currentDay}`}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <InputWrapper required={false} key={field.key}>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Введите или удалите задачу",
                        },
                      ]}
                      noStyle
                    >
                      <Input placeholder="Задача" style={{ width: "85%" }} />
                    </Form.Item>
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(index);
                        setUserTasks((prevUserTasks) => {
                          const updatedTasks = [...prevUserTasks];
                          updatedTasks.splice(index, 1);
                          return updatedTasks;
                        });
                        message.success("Задача удалена");
                      }}
                    />
                  </InputWrapper>
                ))}
                <ButtonWrapper>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setHasTasks(true);
                      add();
                    }}
                    style={{ width: "60%" }}
                    icon={<PlusOutlined />}
                  >
                    Добавить задачу
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => {
                      setHasTasks(true);
                      add("", 0);
                    }}
                    style={{ width: "60%", marginTop: "20px" }}
                    icon={<PlusOutlined />}
                  >
                    Добавить задачу в начало
                  </Button>
                  <Form.ErrorList errors={errors} />
                </ButtonWrapper>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </FormStyled>
      </div>
    </div>
  );
};

export default Modal;
