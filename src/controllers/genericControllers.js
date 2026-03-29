import { createCrudControllers } from './crudFactory.js';
import { TeamMember } from '../models/TeamMember.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { Inquiry } from '../models/Inquiry.js';
import { Subscriber } from '../models/Subscriber.js';
import { PageContent } from '../models/PageContent.js';
import { SEOSettings } from '../models/SEOSettings.js';
import { TechStack } from '../models/TechStack.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { Partner } from '../models/Partner.js';

export const TeamController = createCrudControllers(TeamMember);
export const JobController = createCrudControllers(Job);
export const ApplicationController = createCrudControllers(Application);
export const InquiryController = createCrudControllers(Inquiry);
export const SubscriberController = createCrudControllers(Subscriber);
export const PageContentController = createCrudControllers(PageContent);
export const SEOSettingsController = createCrudControllers(SEOSettings);
export const TechStackController = createCrudControllers(TechStack);
export const PricingPlanController = createCrudControllers(PricingPlan);
export const PartnerController = createCrudControllers(Partner);



