import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filter: GetTasksFilterDto, user) {
    return this.tasksRepository.getTasks(filter, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User) {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task not found`);
    }
  }

  async updateTask(id: string, { status }: UpdateTaskDto, user: User) {
    const updatableTask = await this.getTaskById(id, user);
    updatableTask.status = status;

    await this.tasksRepository.save(updatableTask);
    return updatableTask;
  }
}
