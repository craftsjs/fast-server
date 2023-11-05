import { fastServer } from "../src/server/fast-server";

const server = fastServer();

server.use((req, res, next) => {
    next();
})

server.use('/other-end',(req, res, next) => {
    res.end();
    next();
})

server.get('/other-end', (req, res) => {
    res.json({ message: 'Hello World' });
});

server.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

server.all('/hello', (req, res, next) => {
    next();
})

server.post('/data', (req, res) => {
    res.json({ message: 'Data received' });
});

server.put('/update', (req, res) => {
    res.json({ message: 'Data updated' });
});

server.delete('/delete', (req, res) => {
    res.json({ message: 'Data deleted' });
});

server.patch('/modify', (req, res) => {
    res.json({ message: 'Data modified' });
});

server.options('/', (req, res) => {
    res.json({ message: 'options' });
});

server.head('/', (req, res) => {
    res.json({ message: 'head' });
});


// add router
const router = server.router()
router.get('/:id', (req, res) => {
    res.json({ message: `Hello World with id ${req.params?.id}` });
})

router.post('/:id', (req, res) => {
    res.json({ message:  `Data received with id ${req.params?.id}` });
})

router.put('/:id', (req, res) => {
    res.json({ message: `Data updated with id ${req.params?.id}` });
});

router.delete('/:id', (req, res) => {
    res.json({ message: `Data deleted with id ${req.params?.id}` });
});

router.patch('/:id', (req, res) => {
    res.json({ message: `Data modified with id ${req.params?.id}` });
});

server.use('/tenant', router);

server.listen();

export default server;
