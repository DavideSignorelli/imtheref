import Tabella from "../components/tabella";
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

function home() {
    return (
        <div>
            <Sheet
                sx={{
                    width: "70%",
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                }}
            >
                <Typography level="h1" component="h1" textAlign={"center"}>
                    IMTHEREF
                </Typography>
                <Tabella />
            </Sheet>
        </div>
    );
}

export default home;