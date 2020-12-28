import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../http-exception.filter';
import { ValidationPipe } from '../validation.pipe';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { UpdateDeploymentDto } from './dto/update-deployment.dto';
import { DeploymentsService } from './deployments.service';
import { Deployment } from './deployment.entity';

@Controller('environments')
@UseFilters(HttpExceptionFilter)
export class DeploymentsController {
  private readonly logger = new Logger(DeploymentsController.name);

  constructor(private deploymentsService: DeploymentsService) {}

  @Post(':environment/deployments')
  async create(
    @Param('environment') environment: string,
    @Body(new ValidationPipe())
    createDeployDto: CreateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.log(
      `Creating deployment '${
        createDeployDto.name
      }' in environment ${environment} with properties ${JSON.stringify(
        createDeployDto,
      )} ...`,
    );
    const newDeployment = await this.deploymentsService.create(
      environment,
      createDeployDto,
    );
    this.logger.debug(`Created deployment: ${JSON.stringify(newDeployment)}`);
    return newDeployment;
  }

  @Get(':environment/deployments/:name')
  async get(
    @Param('environment') environment: string,
    @Param('name') name: string,
  ): Promise<Deployment> {
    this.logger.log(
      `Getting deployment ${name} in environment ${environment} ...`,
    );
    const oneDeploy = await this.deploymentsService.getOne(environment, name);
    this.logger.debug(`Got one deployment: ${JSON.stringify(oneDeploy)}`);
    return oneDeploy;
  }

  @Get(':environment/deployments')
  async getAll(
    @Param('environment') environment: string,
  ): Promise<Deployment[]> {
    this.logger.log(`Getting all deployments ...`);
    const deploysInEnv = await this.deploymentsService.getAllIn(environment);
    this.logger.debug(`Got all deployments: ${JSON.stringify(deploysInEnv)}`);
    return deploysInEnv;
  }

  @Put(':environment/deployments/:name')
  async update(
    @Param('environment') environment: string,
    @Param('name') name: string,
    @Body(new ValidationPipe()) updateDeployDto: UpdateDeploymentDto,
  ): Promise<Deployment> {
    this.logger.log(
      `Updating deployment ${name} in ${environment} with ${JSON.stringify(
        updateDeployDto,
      )} ...`,
    );
    const updatedDeploy = await this.deploymentsService.update(
      environment,
      name,
      updateDeployDto,
    );
    this.logger.debug(`Updated deployment: ${JSON.stringify(updatedDeploy)}`);
    return updatedDeploy;
  }

  @Delete(':environment/deployments/:name')
  async delete(
    @Param('environment') environment: string,
    @Param('name') name: string,
  ): Promise<Deployment> {
    this.logger.log(`Deleting deployment ${name} in ${environment} ...`);
    const deletedDeploy = await this.deploymentsService.delete(
      environment,
      name,
    );
    this.logger.debug(`Deleted deployment: ${JSON.stringify(deletedDeploy)}`);
    return deletedDeploy;
  }
}