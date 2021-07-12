import React from 'react';
import { render, screen, fireEvent, waitFor, act, } from '@testing-library/react';
import '@testing-library/jest-dom';
import MockAdapter from 'axios-mock-adapter';
import Http from './utils/Http';
import App from './App';
import userEvent from '@testing-library/user-event';


const mockData = [
    {
        'userId':1,
        'id': 1,
        'title': 'delectus aut autem',
        'completed': false
    },
    {
        'userId': 1,
        'id': 2,
        'title': 'quis ut nam facilis et officia qui',
        'completed': false
    },
    {
        'userId': 1,
        'id': 3,
        'title': 'cde',
        'completed': false
    }
];

jest.spyOn(window, 'alert').mockImplementation(() => {});

beforeEach(() => {
    // here need to mock axios instance (axios.create)
    const mock = new MockAdapter(Http);
    mock.onGet('/todos').reply(200, mockData);
});

describe('App should rendered correctly', () => {
    describe('App component', () => {
        it('should render', () => {
            render(<App />);
            expect(screen.getByText('My todo list')).toBeInTheDocument();
        });

        it('should display todolist when the page was loaded', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(mockData[0].title)).toBeInTheDocument();
                fireEvent.click(screen.queryByTestId(`closeBtn-${mockData[0].id}`));
                expect(screen.queryByText(mockData[0].title)).not.toBeInTheDocument();
                fireEvent.click(screen.queryByTestId(`checkbox-${mockData[1].id}`));
                expect(screen.getByText(mockData[1].title).className).toBe('completed');
                fireEvent.click(screen.queryByTestId(`labelOfCheckbox-${mockData[1].id}`));
                expect(screen.queryByText(mockData[1].title).className).not.toBe('completed');
            });
            // expect(fetch).toHaveBeenCalledTimes(1);
        });
        it('type should be rendered correctly', () => {
            document.body.innerHTML = `<textarea />`
          
            userEvent.type(screen.getByRole('textbox'), 'Hello, World!')
            expect(screen.getByRole('textbox')).toHaveValue('Hello, World!')
          });


        it('click checkbox should be checked', () => {
            const onChange = jest.fn();
            render(<input type="checkbox" onChange={onChange} />);

            const checkbox = screen.getByRole('checkbox');
            userEvent.click(checkbox);
            expect(onChange).toHaveBeenCalled();
            expect(checkbox).toBeChecked();
        });                
          

        it('should alert when text area is empty and add new todo button clicked', async () => {
            render(<App />);

            await waitFor(() => {
                fireEvent.click(screen.getByRole('button', {
                    name: /Add new todo/i
                  }));
                expect(window.alert).toHaveBeenCalled();
            });

        });

        it('should display the response error when adding a new todo item to todolist whose input title is not empty ', async () => {
            render(<App />);

            const mock = new MockAdapter(Http);
            const mockPostData = {
                newTodo: {
                    completed: false,
                    id: '1625799318098',
                    title: 'abc',
                    userId: 2,
                },
            };
            mock.onPost('/todos').reply(400, mockPostData);

            const newTodoName = 'abc';

            fireEvent.change(
                screen.queryByLabelText('Title:'),
                { target: { value: newTodoName } },
            );

            fireEvent.click(screen.getByRole('button', {
                name: /Add new todo/i
              }));
            await waitFor(() => {
                expect(screen.queryByText('Request failed with status code 400')).toBeInTheDocument();
            })
        });

        it('should add a new todo item to todolist successfully when the input title is not empty', async () => {
            render(<App />);

            const mock = new MockAdapter(Http);
            const mockPostData = {
                newTodo: {
                    completed: false,
                    id: '1625799318098',
                    title: 'abc',
                    userId: 2,
                },
            };
            mock.onPost('/todos').reply(200, mockPostData);

            const newTodoName = 'abc';
            fireEvent.change(
                screen.getByLabelText('Title:'),
                { target: { value: newTodoName } },
            );

            fireEvent.click(screen.getByRole('button', {
                name: /Add new todo/i
              }));
            await waitFor(() => {
                expect(screen.getByText(newTodoName)).toBeInTheDocument();
            })
        });
    });
});