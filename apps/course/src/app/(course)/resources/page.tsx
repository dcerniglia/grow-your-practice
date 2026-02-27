import { getResourcesByModule } from '@/lib/course-data'
import { ResourcesClient } from '@/components/resources-client'

export default async function ResourcesPage() {
  const resourcesByModule = await getResourcesByModule()

  return <ResourcesClient resourcesByModule={resourcesByModule} />
}
