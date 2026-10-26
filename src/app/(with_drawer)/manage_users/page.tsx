import { Box, Button, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { addUser, deleteUser, getUsers, isAdmin, setUserPassword } from "src/app/actions/users";
import { Delete } from "@mui/icons-material";
import { redirect } from "next/navigation";
import { UserRole } from "../../../../lib/models/User";

export default async function Page() {
  if (!(await isAdmin())) redirect("/");
  const users = await getUsers();
  return (
    <Box sx={{ maxWidth: 600 }}>
      <Typography variant="h5" fontWeight={"bold"}>
        Users
      </Typography>
      <List sx={{ mb: 2 }}>
        {users.map((user) => (
          <ListItem
            key={user._id}
            sx={{ gap: 2, flexWrap: "wrap" }}
            secondaryAction={user.role !== UserRole.Admin && <DeleteUser id={user._id} />}
          >
            <ListItemText primary={user.username} secondary={user.role} />
            <SetPassword id={user._id} />
          </ListItem>
        ))}
      </List>
      <AddUser />
    </Box>
  );
}

function DeleteUser({ id }: { id: string }) {
  return (
    <form action={deleteUser}>
      <input value={id} hidden readOnly name="id" />
      <IconButton type="submit">
        <Delete />
      </IconButton>
    </form>
  );
}

function SetPassword({ id }: { id: string }) {
  return (
    <form action={setUserPassword} style={{ display: "flex", gap: 8, marginRight: 48 }}>
      <input value={id} hidden readOnly name="id" />
      <TextField size="small" name="password" type="password" label="New password" required />
      <Button type="submit" variant="outlined" size="small">
        Set
      </Button>
    </form>
  );
}

function AddUser() {
  return (
    <form action={addUser} style={{ display: "flex", gap: 8 }}>
      <TextField size="small" name="username" label="Username" required />
      <TextField size="small" name="password" type="password" label="Password" required />
      <Button type="submit" variant="contained">
        Add User
      </Button>
    </form>
  );
}
