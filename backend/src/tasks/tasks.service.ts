import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../common/types/authenticated-user.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

type TaskResponse = {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
};

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  async findAllByUser(user: AuthenticatedUser): Promise<TaskResponse[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: user.id } },
      order: { id: 'DESC' },
    });

    return tasks.map((task) => this.toResponse(task, user.id));
  }

  async create(
    createTaskDto: CreateTaskDto,
    user: AuthenticatedUser,
  ): Promise<TaskResponse> {
    const normalizedTitle = createTaskDto.title.trim();

    if (!normalizedTitle) {
      throw new BadRequestException('Title cannot be empty');
    }

    const task = this.tasksRepository.create({
      title: normalizedTitle,
      completed: createTaskDto.completed ?? false,
      user: { id: user.id },
    });

    const savedTask = await this.tasksRepository.save(task);

    return this.toResponse(savedTask, user.id);
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: AuthenticatedUser,
  ): Promise<TaskResponse> {
    if (
      updateTaskDto.title === undefined &&
      updateTaskDto.completed === undefined
    ) {
      throw new BadRequestException(
        'At least one field is required to update the task',
      );
    }

    const task = await this.findOwnedTaskOrFail(id, user.id);

    if (updateTaskDto.title !== undefined) {
      const normalizedTitle = updateTaskDto.title.trim();

      if (!normalizedTitle) {
        throw new BadRequestException('Title cannot be empty');
      }

      task.title = normalizedTitle;
    }

    if (updateTaskDto.completed !== undefined) {
      task.completed = updateTaskDto.completed;
    }

    const updatedTask = await this.tasksRepository.save(task);

    return this.toResponse(updatedTask, user.id);
  }

  async softDelete(
    id: number,
    user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    const task = await this.findOwnedTaskOrFail(id, user.id);

    await this.tasksRepository.softRemove(task);

    return { message: 'Task deleted successfully' };
  }

  private async findOwnedTaskOrFail(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  private toResponse(task: Task, userId: number): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      completed: task.completed,
      user_id: userId,
    };
  }
}
