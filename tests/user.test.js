const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase);

test('should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Lawrence',
        email: 'law@example.com',
        password: 'law123!$'
    }).expect(201);

    //Assert that db was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //Assertions about response
    expect(response.body).toMatchObject({
        user: {
            name: 'Lawrence',
            email: 'law@example.com'
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe('law123!$');
});

test('should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('should not login nonexistent user', async() => {
    await request(app).post('/users/login').send({
        email: 'nonexistent@gmail.com',
        password: userOne.password
    }).expect(400);
});

test('should get profile for user', async() => {
    await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for unauthenticated users', async() => {
    await request(app)
        .get('/users/profile')
        .send()
        .expect(401);
});

test('should delete account for user', async() => {
    await request(app)
        .del('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('should not delete account for unauthenticated user', async() => {
    await request(app)
        .del('/users/me')
        .send()
        .expect(401);
});

test('should upload avatar image', async() => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Graham'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Graham');
});

test('should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Enugu'
        })
        .expect(400);
})