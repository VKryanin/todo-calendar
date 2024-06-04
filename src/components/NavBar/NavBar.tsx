import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import s from "./NavBar.module.scss";
import { LogoutOutlined } from "@ant-design/icons";

type User = {
  name: string;
};

const NavBar = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const onFinish = (value: { name: string }) => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers) as User[];
      const existingUser = parsedUsers.find((user) => user.name === value.name);
      if (existingUser) {
        setIsLoggedIn(true);
        localStorage.setItem("currentUser", existingUser.name);
        return;
      }
    }

    const newUser: User = { name: value.name };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", newUser.name);
    setUsers(updatedUsers);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("currentUser");
  };

  useEffect(() => {
    const storedCurrentUser = localStorage.getItem("currentUser");
    if (storedCurrentUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <aside className={s.aside}>
      <div className={s.asideTitle}>
        <h2>{`Hello ${
          isLoggedIn ? users[users.length - 1].name : "Guest"
        }`}</h2>
        {isLoggedIn && (
          <LogoutOutlined
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          />
        )}
      </div>

      {!isLoggedIn && (
        <Form form={form} layout="vertical" name="userForm" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Как вас запомнить?"
            rules={[
              { required: true, message: "Пожалуйста, введите ваше имя" },
            ]}
          >
            <Input />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form>
      )}
    </aside>
  );
};

export default NavBar;
